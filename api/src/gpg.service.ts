import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as process from 'process';
import rimraf from 'rimraf';
import { join } from 'path';
import { spawn } from 'child_process';
import { mkdtemp } from 'fs/promises';
import * as os from 'os';
import { Repository } from 'typeorm';
import { ReportEntity } from './report.entity';
import { Length } from 'class-validator';

const tempDirPrefix = `ero-like-${process.pid}-gpg-`;
const GNUPGHOME = process.env.GNUPGHOME;

const regexSigedMessageHeader =
  /-----BEGIN PGP SIGNED MESSAGE-----\n(Hash: ((\w+,?)*)\n)?\n/m;
const signatureHeader = '-----BEGIN PGP SIGNATURE-----';

export class VerifyPayload {
  @Length(90)
  clearSignArmored: string;
}

export class ImportAndVerifyPayload extends VerifyPayload {
  @Length(70, 65536)
  publicKeyArmored: string;

  @Length(90)
  clearSignArmored: string;
}

export class InvalidDataError extends Error {}

@Injectable()
export class GpgService {
  private logger = new Logger(GpgService.name);

  @InjectRepository(ReportEntity)
  private reportRepo: Repository<ReportEntity>;

  public async armor(armoredTextInput: string): Promise<Buffer>;
  public async armor(binaryData: Buffer): Promise<string>;
  public async armor(input: string | Buffer): Promise<string | Buffer> {
    const errs = [];
    const chunks = [] as Array<Buffer | string>;
    const isOutString = typeof input !== 'string';
    const getSignature = spawn(
      'gpg',
      [
        '--no-autostart',
        '--utf8-strings',
        isOutString ? '--enarmor' : '--dearmor',
      ],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
      },
    );
    const codePromise = new Promise((r, reject) => {
      getSignature.on('close', r);
      getSignature.on('error', reject);
    });

    getSignature.stderr.setEncoding('utf-8');
    getSignature.stderr.on('data', (ch) => errs.push(ch));
    if (isOutString) {
      getSignature.stdout.setEncoding('utf-8');
    }
    getSignature.stdout.on('data', (ch) => chunks.push(ch));

    getSignature.stdin.write(input);
    getSignature.stdin.end();
    const code = await codePromise;
    this.logger.debug(`cp gpg --[de|en]armor finished code: ${code}`);
    if (code !== 0) {
      throw new Error('gpg armor failed:' + errs.join(''));
    }
    return isOutString ? chunks.join('') : Buffer.concat(chunks as Buffer[]);
  }

  async verify(verifyPayload: VerifyPayload) {
    const errs = [];
    try {
      const {
        signatureDate,
        usedKeyType,
        usedKeyFingerprint,
        mainKey,
        clearSignDataPart,
        clearSignSignaturePart,
        hash,
      } = await this.verifyCommon(verifyPayload, GNUPGHOME, errs);
      const { signatureAlgorithm, data } = await this.signaturePacket(
        verifyPayload,
        GNUPGHOME,
        errs,
      );
      return {
        signatureDate,
        usedKeyType,
        usedKeyFingerprint,
        mainKey,
        clearSignDataPart,
        clearSignSignaturePart,
        hash,
        signatureAlgorithm,
        signature: data.join(''),
      };
    } catch (e) {
      const log = `${e.message}: ${errs.join()}`;
      if (e instanceof InvalidDataError) {
        this.logger.debug(log);
      } else {
        this.logger.warn(log);
      }
      throw e;
    }
  }

  async loadKey(importPayload: { publicKeyArmored: string }) {
    const errs = [];
    try {
      return await this.importCommon(importPayload, GNUPGHOME, errs);
    } catch (e) {
      const log = `${e.message}: ${errs.join()}`;
      if (e instanceof InvalidDataError) {
        this.logger.debug(log);
      } else {
        this.logger.warn(log);
      }
      throw e;
    }
  }

  async temporaryImportAndVerify(
    importAndVerifyPayload: ImportAndVerifyPayload,
  ) {
    const tempDirPath = await this.mkTmpDir();
    const errs = [];
    try {
      const { importedKeyShort, importedKeyUser } = await this.importCommon(
        importAndVerifyPayload,
        tempDirPath,
        errs,
      );

      const {
        signatureDate,
        usedKeyType,
        usedKeyFingerprint,
        mainKey,
        clearSignDataPart,
        clearSignSignaturePart,
        hash,
      } = await this.verifyCommon(importAndVerifyPayload, tempDirPath, errs);

      if (!mainKey.includes(importedKeyShort)) {
        throw new InvalidDataError(
          'verify: mainKey is not the same as imported key',
        );
      }

      const { signatureAlgorithm, data } = await this.signaturePacket(
        importAndVerifyPayload,
        tempDirPath,
        errs,
      );

      return {
        signatureDate,
        usedKeyType,
        usedKeyFingerprint,
        importedKeyUser,
        mainKey,
        signatureAlgorithm,
        signature: data.join(''),
        clearSignDataPart,
        clearSignSignaturePart,
        hash,
      };
    } catch (e) {
      const log = `${e.message}: ${errs.join()}`;
      if (e instanceof InvalidDataError) {
        this.logger.debug(log);
      } else {
        this.logger.warn(log);
      }
      throw e;
    } finally {
      await rimraf(tempDirPath);
    }
  }

  private async importCommon(
    importPayload: { publicKeyArmored: string },
    gnuPgHome: string,
    errs: string[],
  ) {
    errs.length = 0;
    let out = '';
    const importKey = spawn(
      'gpg',
      [
        '--no-autostart',
        '--utf8-strings',
        '--lock-once',
        '--require-cross-certification',
        '--with-fingerprint',
        '--with-subkey-fingerprint',
        '-v',
        '--import',
        '-',
      ],
      {
        cwd: gnuPgHome,
        stdio: 'pipe',
        env: {
          GNUPGHOME: gnuPgHome,
          TZ: 'UTC',
        },
      },
    );
    const codePromise = new Promise((r, reject) => {
      importKey.on('close', r);
      importKey.on('error', reject);
    });

    importKey.stderr.setEncoding('utf-8');
    importKey.stderr.on('data', (ch) => errs.push(ch));
    importKey.stdout.setEncoding('utf-8');
    importKey.stdout.on('data', (ch) => (out += ch));
    this.logger.debug(`cp gpg --import pid: ${importKey.pid}`);

    importKey.stdin.write(importPayload.publicKeyArmored);
    importKey.stdin.end();
    const code = await codePromise;
    this.logger.debug(`cp gpg --import finished code: ${code}`);
    if (code !== 0) {
      throw new InvalidDataError('gpg exited with non zero status');
    }
    out += errs.join('');
    const importMatchKey = out.match(
      /gpg: key ([0-9A-F]+): public key "(.+)" imported\n/,
    );
    if (!importMatchKey) {
      throw new InvalidDataError('gpg exited without key fingerprint');
    }
    const importedKeyShort = importMatchKey[1];
    const importedKeyUser = importMatchKey[2];
    const importMatchCount = out.match(/gpg:\s+imported: (\d+)/);
    if (!importMatchCount) {
      throw new InvalidDataError("gpg didn't imported keys");
    }
    if (importMatchCount[1] != '1') {
      throw new InvalidDataError('gpg imported more than one keys');
    }

    return {
      importedKeyShort,
      importedKeyUser,
    };
  }

  private async verifyCommon(
    importAndVerifyPayload: VerifyPayload,
    gnuPgHome: string,
    errs: string[],
  ) {
    errs.length = 0;
    let out = '';

    const verify = spawn(
      'gpg',
      [
        '--no-autostart',
        '--utf8-strings',
        '--lock-once',
        '--require-cross-certification',
        '--with-fingerprint',
        '--with-subkey-fingerprint',
        '-v',
        '--verify',
      ],
      {
        cwd: gnuPgHome,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          GNUPGHOME: gnuPgHome,
          TZ: 'UTC',
        },
      },
    );
    const codePromise = new Promise((r, reject) => {
      verify.on('close', r);
      verify.on('error', reject);
    });
    verify.stderr.setEncoding('utf-8');
    verify.stderr.on('data', (ch) => errs.push(ch));
    verify.stdout.setEncoding('utf-8');
    verify.stdout.on('data', (ch) => (out += ch));
    this.logger.debug(`cp gpg --verify pid: ${verify.pid}`);

    verify.stdin.write(importAndVerifyPayload.clearSignArmored);
    verify.stdin.end();
    const code = await codePromise;
    this.logger.debug(`cp gpg --verify finished code: ${code}`);
    out += errs.join('');
    if (code !== 0) {
      if (out.includes("Can't check signature: No public key")) {
        throw new InvalidDataError(
          'gpg verification failed: signature made by not included key',
        );
      }
      throw new InvalidDataError('gpg verification failed');
    }
    const verifyMatchKey = out.match(
      /gpg: Signature made (.+)\ngpg:\s+using (\w+) key ([0-9A-F]+)/m,
    );
    if (!verifyMatchKey) {
      throw new InvalidDataError(
        'verify: there is no signature date, key type, key fingerprint',
      );
    }
    const signatureDate = this.parseDateString(verifyMatchKey[1]);
    const usedKeyType = verifyMatchKey[2];
    const usedKeyFingerprint = verifyMatchKey[3];

    const verifyMatchMainKey = out.match(
      /Primary key fingerprint: ([0-9A-F ]+)/,
    );
    if (!verifyMatchMainKey) {
      throw new InvalidDataError('verify: there is no primary key fingerprint');
    }
    const mainKey = verifyMatchMainKey[1].replace(/\s+/g, '');

    const indexOfSignature =
      importAndVerifyPayload.clearSignArmored.indexOf(signatureHeader);
    const clearSignDataPart = importAndVerifyPayload.clearSignArmored
      .slice(0, indexOfSignature - 1)
      .replace(regexSigedMessageHeader, '');
    const clearSignSignaturePart =
      importAndVerifyPayload.clearSignArmored.slice(indexOfSignature);

    const hashMatch = importAndVerifyPayload.clearSignArmored.match(
      regexSigedMessageHeader,
    );
    const hash = hashMatch && hashMatch[2] ? hashMatch[2].split(',') : ['MD5'];

    return {
      signatureDate,
      usedKeyType,
      usedKeyFingerprint,
      mainKey,
      clearSignDataPart,
      clearSignSignaturePart,
      hash,
    };
  }

  private async signaturePacket(
    importAndVerifyPayload: VerifyPayload,
    gnuPgHome: string,
    errs: string[],
  ) {
    const trimPosition = importAndVerifyPayload.clearSignArmored.indexOf(
      '-----BEGIN PGP SIGNATURE-----',
    );
    const signatureBlock =
      importAndVerifyPayload.clearSignArmored.slice(trimPosition);
    errs.length = 0;
    let out = '';
    const getSignature = spawn(
      'gpg',
      [
        '--no-autostart',
        '--utf8-strings',
        '--lock-once',
        '-v',
        '--list-packets',
      ],
      {
        cwd: gnuPgHome,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          GNUPGHOME: gnuPgHome,
          TZ: 'UTC',
        },
      },
    );
    const codePromise = new Promise((r, reject) => {
      getSignature.on('close', r);
      getSignature.on('error', reject);
    });
    getSignature.stderr.setEncoding('utf-8');
    getSignature.stderr.on('data', (ch) => errs.push(ch));
    getSignature.stdout.setEncoding('utf-8');
    getSignature.stdout.on('data', (ch) => (out += ch));
    this.logger.debug(`cp gpg --list-packets pid: ${getSignature.pid}`);

    getSignature.stdin.write(signatureBlock);
    getSignature.stdin.end();
    const code = await codePromise;
    this.logger.debug(`cp gpg --list-packets finished code: ${code}`);
    out += errs.join('');
    if (code !== 0) {
      if (out.includes("Can't check signature: No public key")) {
        throw new InvalidDataError(
          'gpg verification failed: signature made by not included key',
        );
      }
      throw new InvalidDataError('gpg verification failed');
    }
    if (
      out.indexOf('signature packet') !== out.lastIndexOf('signature packet')
    ) {
      throw new InvalidDataError('multiple signature is not implemented'); // cause security problems in regex :)
    }
    const getSignatureMatchSignaturePacket = out.match(
      /:signature packet: algo (\d+), keyid ([0-9A-F]+)/m,
    );
    if (!getSignatureMatchSignaturePacket) {
      throw new InvalidDataError('signature packet not found');
    }
    const signatureAlgorithm = getSignatureMatchSignaturePacket[1];

    const getSignatureMatchMainKeyV4 = out.match(
      /\thashed subpkt 33 .+issuer fpr v4 ([0-9A-F]+)/m,
    );
    const mainKeyV4 = getSignatureMatchMainKeyV4
      ? getSignatureMatchMainKeyV4[1]
      : null;

    const getSignatureMatchMainKeyShort = out.match(
      /\tsubpkt 16 .+issuer key ID ([0-9A-F]+)/m,
    );
    const mainKeyShort = getSignatureMatchMainKeyShort
      ? getSignatureMatchMainKeyShort[1]
      : null;

    const getSignatureMatchData = out.match(/(\s+data: ([0-9A-F]+))+\n/m);
    if (!getSignatureMatchData) {
      throw new InvalidDataError(
        'signature packet not contains signature data',
      );
    }
    const data = getSignatureMatchData[0]
      .split(/\s+data: /)
      .map((s) => s.trim())
      .filter((s) => s.length);

    return {
      mainKeyV4,
      mainKeyShort,
      signatureAlgorithm,
      data,
    };
  }

  private async mkTmpDir() {
    const tempDirPath = await mkdtemp(join(os.tmpdir(), tempDirPrefix));
    this.logger.debug(`Temporary directory created at: ${tempDirPath}`);
    return tempDirPath;
  }

  private parseDateString(gpgDateString: string): Date {
    const dateParts = gpgDateString.trim().split(/\s+/);
    // 'Sat Mar  4 21:05:49 2023 UTC'
    // 'Aug  19,  1975 23:15:30 UTC'
    const s = `${dateParts[1]}, ${dateParts[2]} ${dateParts[4]} ${dateParts[3]} ${dateParts[5]}`;
    const d = new Date(s);
    if (d.toString().indexOf(dateParts[0])) {
      throw new Error('Date parse problem, input: ' + gpgDateString);
    }
    return d;
  }
}
