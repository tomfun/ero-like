import { Injectable, Logger } from '@nestjs/common';
import * as process from 'process';
import rimraf from 'rimraf';
import { join } from 'path';
import { spawn } from 'child_process';
import { mkdtemp } from 'fs/promises';
import * as os from 'os';
import { Connection, Repository } from 'typeorm';
export {
  ReportForList,
  ReportBodyPayload,
  ReportEntity,
} from './report.entity';
import {
  ReportEntity,
  ReportForList,
  ReportBodyPayload,
} from './report.entity';
import { Length } from 'class-validator';

const tempDirPrefix = `ero-like-${process.pid}-gpg-`;

export class ImportAndVerifyPayload {
  @Length(70, 65536)
  publicKeyArmored: string;

  @Length(90)
  clearSignArmored: string;
}

export class InvalidDataError extends Error {}

@Injectable()
export class GpgService {
  private logger = new Logger(GpgService.name);

  private reportRepo: Repository<ReportEntity>;
  constructor(connection: Connection) {
    this.reportRepo = connection.getRepository<ReportEntity>(ReportEntity);
  }

  async temporaryImportAndVerify(
    importAndVerifyPayload: ImportAndVerifyPayload,
  ) {
    const tempDirPath = await this.mkTmpDir();
    const errs = [];
    let out = ``;
    try {
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
          cwd: tempDirPath,
          stdio: 'pipe',
          env: {
            GNUPGHOME: tempDirPath,
          },
        },
      );
      let codePromise = new Promise((r, reject) => {
        importKey.on('close', r);
        importKey.on('error', reject);
      });

      importKey.stderr.setEncoding('utf-8');
      importKey.stderr.on('data', (ch) => errs.push(ch));
      importKey.stdout.setEncoding('utf-8');
      importKey.stdout.on('data', (ch) => (out += ch));
      this.logger.debug(`cp gpg --import pid: ${importKey.pid}`);

      importKey.stdin.write(importAndVerifyPayload.publicKeyArmored);
      importKey.stdin.end();
      let code = await codePromise;
      this.logger.debug(`cp gpg --import finished code: ${code}`);
      if (code !== 0) {
        throw new InvalidDataError('gpg exited with non zero status');
      }
      out += errs.join('');
      const importMatchKey = out.match(
        /gpg: key ([0-9A-F]+): public key ".+" imported\n/,
      );
      if (!importMatchKey) {
        throw new InvalidDataError('gpg exited without key fingerprint');
      }
      const importedKeyShort = importMatchKey[1];
      const importMatchCount = out.match(/gpg:\s+imported: (\d+)/)
      if (!importMatchCount) {
        throw new InvalidDataError('gpg didn\'t imported keys');
      }
      if (importMatchCount[1] != '1') {
        throw new InvalidDataError('gpg imported more than one keys');
      }

      errs.length = 0;
      out = '';
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
          cwd: tempDirPath,
          stdio: ['pipe', 'pipe', 'pipe'],
          env: {
            GNUPGHOME: tempDirPath,
          },
        },
      );
      codePromise = new Promise((r, reject) => {
        verify.on('close', r);
        verify.on('error', reject);
      });
      verify.stderr.setEncoding('utf-8');
      verify.stderr.on('data', (ch) => errs.push(ch));
      verify.stdout.setEncoding('utf-8');
      verify.stdout.on('data', (ch) => (out += ch));
      this.logger.debug(`cp gpg --verify pid: ${importKey.pid}`);

      verify.stdin.write(importAndVerifyPayload.clearSignArmored);
      verify.stdin.end();
      code = await codePromise;
      this.logger.debug(`cp gpg --verify finished code: ${code}`);
      out += errs.join('');
      if (code !== 0) {
        if (out.includes('Can\'t check signature: No public key')) {
          throw new InvalidDataError('gpg verification failed: signature made by not included key');
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
      const signatureDate = verifyMatchKey[1];
      const usedKeyType = verifyMatchKey[2];
      const usedKeyFingerprint = verifyMatchKey[3];

      const verifyMatchMainKey = out.match(
        /Primary key fingerprint: ([0-9A-F ]+)/,
      );
      if (!verifyMatchMainKey) {
        throw new InvalidDataError('verify: there is no primary key fingerprint');
      }
      const mainKey = verifyMatchMainKey[1].replace(/\s+/g, '');
      if (!mainKey.includes(importedKeyShort)) {
        throw new InvalidDataError('verify: mainKey is not the same as imported key');
      }

      const trimPosition = importAndVerifyPayload.clearSignArmored.indexOf('-----BEGIN PGP SIGNATURE-----');
      const signatureBlock = importAndVerifyPayload.clearSignArmored.slice(trimPosition);
      errs.length = 0;
      out = '';
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
          cwd: tempDirPath,
          stdio: ['pipe', 'pipe', 'pipe'],
          env: {
            GNUPGHOME: tempDirPath,
          },
        },
      );
      codePromise = new Promise((r, reject) => {
        getSignature.on('close', r);
        getSignature.on('error', reject);
      });
      getSignature.stderr.setEncoding('utf-8');
      getSignature.stderr.on('data', (ch) => errs.push(ch));
      getSignature.stdout.setEncoding('utf-8');
      getSignature.stdout.on('data', (ch) => (out += ch));
      this.logger.debug(`cp gpg --list-packets pid: ${importKey.pid}`);

      getSignature.stdin.write(signatureBlock);
      getSignature.stdin.end();
      code = await codePromise;
      this.logger.debug(`cp gpg --list-packets finished code: ${code}`);
      out += errs.join('');
      if (code !== 0) {
        if (out.includes('Can\'t check signature: No public key')) {
          throw new InvalidDataError('gpg verification failed: signature made by not included key');
        }
        throw new InvalidDataError('gpg verification failed');
      }
      if (out.indexOf('signature packet') !== out.lastIndexOf('signature packet')) {
        throw new InvalidDataError('multiple signature is not implemented'); // cause security problems in regex :)
      }
      const getSignatureMatchSignaturePacket = out.match(
        /:signature packet: algo (\d+), keyid ([0-9A-F]+)/m,
      );
      if (!getSignatureMatchSignaturePacket) {
        throw new InvalidDataError('signature packet not found');
      }
      const signatureAlgorithm = getSignatureMatchSignaturePacket[1];

      const getSignatureMatchData = out.match(
        /(\s+data: ([0-9A-F]+))+\n/m,
      );
      if (!getSignatureMatchData) {
        throw new InvalidDataError('signature packet not contains signature data');
      }
      const data = getSignatureMatchData[0].split(/\s+data: /)
        .map((s) => s.trim())
        .filter((s) => s.length);

      return {
        signatureDate,
        usedKeyType,
        usedKeyFingerprint,
        mainKey,
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
    } finally {
      await rimraf(tempDirPath);
    }
  }
  private async mkTmpDir() {
    const tempDirPath = await mkdtemp(join(os.tmpdir(), tempDirPrefix));
    this.logger.debug(`Temporary directory created at: ${tempDirPath}`);
    return tempDirPath;
  }
}
