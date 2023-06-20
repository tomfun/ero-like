import * as events from 'events';

import { ConsoleLogger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import Server from 'fastify';
import * as qs from 'qs';
import { AppSchema } from '../src/app.schema';
import { BootstrapModule } from '../src/strict-config/bootstrap.module';
import { CONFIG_OBJECT_TOKEN } from '../src/strict-config/strict-config.constants';
import { StrictConfigModule } from '../src/strict-config/strict-config.module';
import { AppModule } from './../src/app.module';

const TIMER_MAX = 5000;

describe('init (e2e)', () => {
  let config: AppSchema;
  let app: NestFastifyApplication;
  const logger = new ConsoleLogger();

  beforeAll(async () => {
    logger.setLogLevels(['error', 'warn']);
    events.EventEmitter.defaultMaxListeners = 15;
    process.setMaxListeners(15);
    const strictConfigForRoot = StrictConfigModule.forRoot<any, any>({
      schemes: [],
      schema: AppSchema,
    });

    const appConfig = await Test.createTestingModule({
      imports: [
        BootstrapModule.boot({
          imports: [strictConfigForRoot],
        }),
      ],
    }).compile();
    config = appConfig.get<AppSchema>(CONFIG_OBJECT_TOKEN);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.forConfig(config)],
    })
      .setLogger(logger)
      .compile();

    const server = Server({
      trustProxy: 0,
      logger: config.logHttp,
      querystringParser: (str) => qs.parse(str),
    });
    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(server),
      { logger },
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    if (config.log === '1') {
      logger.setLogLevels(['log', 'debug', 'error', 'verbose', 'warn']);
    }
  });

  // afterEach(() => expect(nock.isDone()).toBeTruthy());
  // afterEach(() => nock.cleanAll());
  afterEach(() => app.flushLogs());

  afterAll(async function () {
    await app.close();
  }, TIMER_MAX * 5);

  it(`POST /api/user/dry-run 400 invalid (3 keys)`, () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/api/user/dry-run',
        payload: {
          clearSignArmored:
            '-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA512\n\nI read and agree with all terms of use of ero-like and confirm my registration on ero-like\n-----BEGIN PGP SIGNATURE-----\n\niQIzBAEBCgAdFiEEBfntiBKqjNUqcWskquatlAIqu/EFAmQCVw8ACgkQquatlAIq\nu/GJRw//fpu1Y0FqfN1HITc+hnUvptoWT8i98dF2RFBIyinly+KvgHSQJHjUr1Ks\njNgw+BHMkj9weG2VVH5xGNUrP3j7GYKIUAnniDBLUm1HE/XDq2mSCzc0cpX7reGy\nuhK4RFKykBIe2oF8PElNBfl/iTofcDNU6CVAfvGhpa+yX5GCrgF2UF7mSfYJqAAx\nbqWAtUUfKOS9eDtlmSI618kKF7Fz936sYKfThjiKJ9W8leF7BHt+4bVa0mLY4r65\nqSX9yUwDNB9q1QzDylM/jEmcXtD9Nf87wOXUh7omlOQmUozDnTX8IJiws+ImPipG\nPpFTvhSFmDHm+8oDWkj27I1ZfdQDI8GWpzXkIQwTUheZZiIainZ8Zce2otaf0d0J\nb3sQm+eIf+NPKcMelMqNrByriY9WJRbqNSTn5G20qWBq7fsxXPDvxRy+taGdctQi\nGkh84VlfF8+/q8/P5NCx8DJgmKU/HctB/Ns8aHTmZCf4Fm0R5yCU9tozVoaUyqw+\n2vFA2Qmg0WEPXQs+inqIKw9UMH+oy4soHX3pSiXqv0Van9ysPvJ7x9nz2taI5XCA\nGc6PnN4QW6xZog/IsaoykiOFhW28hMXTMCYGvjbspWw4JtiqehzgyS8jY9nrToub\nQIdSswmBJN8Sp8eNQ9jjGAvJZOzhBBMnFD1NAkbTBJ4zZb02bbY=\n=PjF2\n-----END PGP SIGNATURE-----',
          publicKeyArmored:
            '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\nrJo=\n=7Ccm\n-----END PGP PUBLIC KEY BLOCK-----',
        },
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        const json = result.json();
        expect(json).toHaveProperty('message');
        expect(json).toHaveProperty(
          'error',
          expect.stringMatching('Bad Request'),
        );
        expect(json).toHaveProperty(
          'message',
          expect.stringMatching('gpg imported more than one keys'),
        );
      });
  });
  const users = {
    tomfun: {
      clearSignArmored: {
        hash: 'SHA512',
        clear:
          'I read and agree with all terms of use of ero-like and confirm my registration on ero-like',
        signBlock:
          '-----BEGIN PGP SIGNATURE-----\n\niQIzBAEBCgAdFiEEBfntiBKqjNUqcWskquatlAIqu/EFAmQCVw8ACgkQquatlAIq\nu/GJRw//fpu1Y0FqfN1HITc+hnUvptoWT8i98dF2RFBIyinly+KvgHSQJHjUr1Ks\njNgw+BHMkj9weG2VVH5xGNUrP3j7GYKIUAnniDBLUm1HE/XDq2mSCzc0cpX7reGy\nuhK4RFKykBIe2oF8PElNBfl/iTofcDNU6CVAfvGhpa+yX5GCrgF2UF7mSfYJqAAx\nbqWAtUUfKOS9eDtlmSI618kKF7Fz936sYKfThjiKJ9W8leF7BHt+4bVa0mLY4r65\nqSX9yUwDNB9q1QzDylM/jEmcXtD9Nf87wOXUh7omlOQmUozDnTX8IJiws+ImPipG\nPpFTvhSFmDHm+8oDWkj27I1ZfdQDI8GWpzXkIQwTUheZZiIainZ8Zce2otaf0d0J\nb3sQm+eIf+NPKcMelMqNrByriY9WJRbqNSTn5G20qWBq7fsxXPDvxRy+taGdctQi\nGkh84VlfF8+/q8/P5NCx8DJgmKU/HctB/Ns8aHTmZCf4Fm0R5yCU9tozVoaUyqw+\n2vFA2Qmg0WEPXQs+inqIKw9UMH+oy4soHX3pSiXqv0Van9ysPvJ7x9nz2taI5XCA\nGc6PnN4QW6xZog/IsaoykiOFhW28hMXTMCYGvjbspWw4JtiqehzgyS8jY9nrToub\nQIdSswmBJN8Sp8eNQ9jjGAvJZOzhBBMnFD1NAkbTBJ4zZb02bbY=\n=PjF2\n-----END PGP SIGNATURE-----',
        signature:
          '7E9BB563416A7CDD4721373E86752FA6DA164FC8BDF1D176445048CA29E5CBE2AF8074902478D4AF52AC8CD830F811CC923F70786D95547E7118D52B3F78FB1982885009E788304B526D4713F5C3AB69920B37347295FBADE1B2BA12B84452B290121EDA817C3C494D05F97F893A1F703354E825407EF1A1A5AFB25F9182AE0176505EE649F609A800316EA580B5451F28E4BD783B6599223AD7C90A17B173F77EAC60A7D386388A27D5BC95E17B047B7EE1B55AD262D8E2BEB9A925FDC94C03341F6AD50CC3CA533F8C499C5ED0FD35FF3BC0E5D487BA2694E426528CC39D35FC2098B0B3E2263E2A463E9153BE14859831E6FBCA035A48F6EC8D597DD40323C196A735E4210C1352179966221A8A767C65C7B6A2D69FD1DD096F7B109BE7887FE34F29C31E94CA8DAC1CAB898F562516EA3524E7E46DB4A9606AEDFB315CF0EFC51CBEB5A19D72D4221A487CE1595F17CFBFABCFCFE4D0B1F0326098A53F1DCB41FCDB3C6874E66427F8166D11E72094F6DA33568694CAAC3EDAF140D909A0D1610F5D0B3E8A7A882B0F54307FA8CB8B281D7DE94A25EABF455A9FDCAC3EF27BC7D9F3DAD688E5708019CE8F9CDE105BAC59A20FC8B1AA32922385856DBC84C5D3302606BE36ECA56C3826D8AA7A1CE0C92F2363D9EB4E8B9B408752B3098124DF12A7C78D43D8E3180BC964ECE1041327143D4D0246D3049E3365BD366DB6',
      },
      publicKeyArmored:
        '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\nyB2jQjJns1lWvQ==\n=qQ0g\n-----END PGP PUBLIC KEY BLOCK-----\n',
      key1: {
        publicKey0:
          'A7862A50B0D23632CC3F5810FC33AA31A411B6926319027AFDC5EEC7FF75BE92CB19E3A55D8933F44B534ABE9C3E78AEDC4EFDB1BEDF7B3EB786E2234531CE799505CB581A07E61AE9B8D0E31F405A14F0FE52CA43BAE88063D9D33F21B34024CE4D1B4A581AB2240B9A1F4FF1832AAD431637C8EC9AF98E0F933742C8FC9F3A18006E97D003CAAA7E8B924532791039570553A489D3E0DE64AE59349F81A5552064F88DAAD77352F8C7DC07BE576AA9F2CF42724DA24DD167314F918FC47A5BBBF320AEFFCA083B30226A0BBAE62A949F02A95731FBFBA4CB2FBE228CD86DA866BA67B9E302D62F68143E9CF11885443932C6F2FD90EB1B9D8504DAA3CB8262A05E20E864992ABF2141FABAA46712CE0690CF1CFC076AE59196BBF245E36F46962653B457837D7E3C83CFB941E75CBF60CE7BE57C535DEECD0326B05BA8409FC144E386EE0194E656586750BA893B00CE4ADA0797A8A5415B9E5F40E8486BC624344F2E96190C9D308E7479C5FFE78D32A2FE9E371094E8B7C25FC808056C7A292A13A1AE11D415D061582E0347D71479B194BEF1B4565369BE54F009E99D54649B13218DB3576E9ED2874A3838C6B9A3A6A219963BCFF38847D64B67B817E67822B7EA600ECBAB83A165BCC0AB55B3468FC7C0B0070555B3C34DD5CEB344FA75C112CD9A01BADACFAF5A0131AE0C12A88F8C866944D7D7CB427A059982ACA9',
        publicKey1: '010001',
        created: 1658763710,
        keyId: 'AAE6AD94022ABBF1',
        v4: '05F9ED8812AA8CD52A716B24AAE6AD94022ABBF1',
      },
    },
  };

  async function createTomfunUserAndCheck(url) {
    const { clearSignArmored, publicKeyArmored, key1 } = users.tomfun;
    const result = await app.inject({
      method: 'PATCH',
      url,
      payload: {
        clearSignArmored: `-----BEGIN PGP SIGNED MESSAGE-----\nHash: ${clearSignArmored.hash}\n\n${clearSignArmored.clear}\n${clearSignArmored.signBlock}`,
        publicKeyArmored,
      },
    });
    expect(result.statusCode).toEqual(200);
    const json = result.json();
    expect(json).toMatchObject({
      nick: expect.stringMatching(/^Hryhorii \(Greg\) Kotov|Grigory Kotov$/),
      agreementSignature: {
        signedAt: '2023-03-03T20:22:39.000Z',
        hash: [clearSignArmored.hash],
        primaryKeyFingerprint: key1.v4,
        usedKeyFingerprint: key1.v4,
        signature: clearSignArmored.signature,
        // packet: 'skip for now',
        publicKey: {
          createdAt: '2022-07-25T15:41:50.000Z',
          invalidAt: null,
          type: '1-4096',
          primaryKeyFingerprint: key1.v4,
          publicKeyFingerprint: key1.v4,
          publicKey: key1.publicKey0 + key1.publicKey1,
          block: {
            type: 'PGP PUBLIC KEY BLOCK',
            blockArmored: publicKeyArmored,
          },
        },
        data: {
          type: 'text',
          mime: 'text/plain',
          sha256:
            '9c57803c40bc8088c3e3c836ac97a67d0db16baada45b725b20150fb5de74281',
          clearSignDataPart: clearSignArmored.clear,
        },
        block: {
          type: 'PGP SIGNATURE',
          blockArmored: clearSignArmored.signBlock,
        },
      },
    });
    return result;
  }

  it(`POST /api/user/dry-run 200`, async () => {
    await createTomfunUserAndCheck('/api/user/dry-run');
  });

  describe('idempotence', () => {
    let createdUser;

    beforeAll(async () => {
      const result = await createTomfunUserAndCheck('/api/user');
      createdUser = result.json();
      expect(createdUser).toHaveProperty('id', expect.any(String));
    });

    it.each([1, 2])('get same user %i', async () => {
      const result = await createTomfunUserAndCheck('/api/user');
      expect(result.json()).toStrictEqual(createdUser);
    });

    it.each([1, 2])('get same user dry run %i', async () => {
      const result = await createTomfunUserAndCheck('/api/user/dry-run');
      expect(result.json()).toStrictEqual(createdUser);
    });
  });

  const reports = {
    extraField: {
      substances: [
        {
          timeSecond: 0,
          dose: 10,
          doseUnit: 'mg',
          namePsychonautWikiOrg: '2C-I',
          routeOfAdministration: 'insufflated',
          activeSubstance: '2C-I',
          surePercent: 95,
        },
        {
          timeSecond: 360,
          dose: 10,
          doseUnit: 'mg',
          namePsychonautWikiOrg: '2C-I',
          routeOfAdministration: 'insufflated',
          activeSubstance: '2C-I',
          surePercent: 95,
        },
      ],
      timeLineReport: [
        {
          timeSecond: 0,
          report: 'Печёт пиздец',
        },
        {
          timeSecond: 300,
          report: 'Ну что-то вроде есть',
        },
        {
          timeSecond: 600,
          report:
            'Душевная лёгкость, вкус чая будто тает во рту, свет стал ламповым, атмосфера отдаёт пленящим теплом',
        },
      ],
      background:
        'А жизнь как масло, а ты как сыр в жопе перепробовав всё говно, остаёшься вонять благородной плесенью',
      dateTimestamp: 1678021709,
      title: 'Вечерний променад',
    },
    ok1: `{"background":"А жизнь как масло, а ты как сыр в жопе перепробовав всё говно, остаёшься вонять благородной плесенью","dateTimestamp":1678021709,"substances":[{"dose":10,"doseUnit":"mg","namePsychonautWikiOrg":"2C-I","routeOfAdministration":"insufflated","surePercent":95,"timeSecond":0},{"dose":10,"doseUnit":"mg","namePsychonautWikiOrg":"2C-I","routeOfAdministration":"insufflated","surePercent":95,"timeSecond":360}],"timeLineReport":[{"report":"Печёт пиздец","timeSecond":0},{"report":"Ну что-то вроде есть","timeSecond":300},{"report":"Душевная лёгкость, вкус чая будто тает во рту, свет стал ламповым, атмосфера отдаёт пленящим теплом","timeSecond":600}],"title":"Вечерний променад"}`,
    signatureArmored1: `-----BEGIN PGP SIGNATURE-----

iQIzBAEBCgAdFiEEBfntiBKqjNUqcWskquatlAIqu/EFAmRf08UACgkQquatlAIq
u/HAzA//Rx4vJo32gInAtG7rT5ULAz+Jw6utCT2N4W8NrhiZn27aVd91CnQz+Tlh
CGSN2ev7b+ODZlpByj8HaFIENObPy+k6SL7HMqkAn7gDn0dTppculkkpi8cvzD19
iuc62x1xNcBwetLxM8TSODRJXYzbciqwudcFop82yFUFJREaKL+cKu4FITva25Nf
Bn7LnmMxM1bJeknrHknB5F5qjgIEdjtSz8Ce0aaFgYEe3xMQGGLBCc6bBB3irqG2
8tyK64dIeyRoV1DOpcFqrJpoE/a4slnK24RnnjNSVR2ENDc+xCBoJEOWpjh/NfNH
pzF3FkJAjNse7E9RuQHUsr+3zbf0zH7FE17dFMoTTvRkqM83o7d1NoJq7yyTvEPQ
E/ZzTR/ZsakTPBTUOhXURYaJiPRVInhOHV4pMc0sf7XLxFa81Z7Uh+jv490foXh7
a7ksPp17iGKfpXxaxUBqVRCmgQUonL7DEnzPe7yKskeiqKXhgQYSjy9yeoaFuYOi
RTE7g+5IstZGdF7Avodfq1rL5B3W4TcFzL2ZRBwrE9kN8EfAwHazmzS1TpNHrk4S
YO8xR8wqClwK0743+7AQcb9rCibV8XJbQHVDkyeNoQgM+OMKA96sUUcYORVfq+JX
pXcpAnsZczdDma+OQayFT77DX20LldOZ+pDNUL3cAmP0JRa0jTg=
=3FlI
-----END PGP SIGNATURE-----`,
  };

  it(`POST /api/report/validate 200`, async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/api/report/validate',
      payload: reports.extraField,
    });
    expect(result.statusCode).toEqual(200);
    const json = result.json();
    expect(json).toStrictEqual(JSON.parse(reports.ok1));
    expect(result.body).toEqual(reports.ok1);
  });

  describe('report', () => {
    let createdUser;
    beforeAll(async () => {
      const result = await createTomfunUserAndCheck('/api/user');
      createdUser = result.json();
      expect(createdUser).toHaveProperty('id', expect.any(String));
    });

    it(`PATCH /api/report 400`, async () => {
      const result = await app.inject({
        method: 'PATCH',
        url: '/api/report',
        headers: {
          'Content-Type': 'text/plain',
        },
        payload: `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

{"substances":[{"timeSecond":0,"dose":1,"doseUnit":"mg","namePsychonautWikiOrg":"MDMA","routeOfAdministration":"oral","activeSubstance":"MDMA","surePercent":95},{"timeSecond":7200,"dose":10,"doseUnit":"mg","namePsychonautWikiOrg":"2C-B","routeOfAdministration":"insufflated","activeSubstance":"2C-B","surePercent":95}],"timeLineReport":[{"timeSecond":0,"report":"Вкинул"},{"timeSecond":300,"report":"Ничего"},{"timeSecond":1200,"report":"Ничего"},{"timeSecond":2400,"report":"Заебись"}],"background":"А жизнь как масло, а ты как сыр в жопе перепробовав всё говно, остаёшься вонять благородной плесенью","dateTimestamp":1658021709,"title":"Шо попало"}
-----BEGIN PGP SIGNATURE-----

iQIzBAEBCgAdFiEEBfntiBKqjNUqcWskquatlAIqu/EFAmQ4D7IACgkQquatlAIq
u/Frvg/9EAe1QHxtHWZlfXVYRdkvhqcOl0a2fFBHIqd/4tZRmf7HMykQPrGWP/Xn
gU/QbcOmPO/wj+6GfPQxD6cWARAsj3KP4TkVlc6E36TYRb9L/uXW7L0j5vQWe84v
h/3ZF2e1Ak5clW15AJxOdG/M9JyLLDs8SZUQez7IfCOKsK2nZ3BLwp3W1u6Six0e
Y6lMat27mLd8Ti6fvZBS6PAu2GayuClU9FevuYEewsxbYk0UHhrMOJzXGgpYmcE8
Je1duuaG3IjQQB6djssZCYekWBWiqwBC7m2Bnhp07IqXH1ci5jU9cHqKwRL1w5h+
BPSs9pzbNJFmkuvXEJsftTd70eMKar51eoMCbbD1PbuWAm12acO1VR+qELRLUWr8
YUlsA0Vptln9S3c2+XEyJUtKYVaXCQdYWv5kHYlsNI69vWK2wXKdVfBHVxkNYzfN
9fVwxqvj8xiR0DxFtJPkHbsfVJFBu3bbd5QKK2oOm0WwMVUDOsg8z3Y9AlFbkrbx
HyV5oaSH2flrzuiCXi/Y+QP5OPfGXvxJBagR2ACAhsEQx95arGhZmzNr42NUUzD8
NDJd8cFUBpHGYEqOeoTaogfQ9Cn9uX7cnTyoJu0HZVVrLyB1G12GGvbY7DDPPZeg
EWJ4a7iMkXHQ4gXamxtdcDTeFjUAVpPxfjzPyG0bkLRGTmV8fBQ=
=BZBx
-----END PGP SIGNATURE-----`,
      });
      expect(result.statusCode).toEqual(400);
      const json = result.json();
      expect(json).toMatchObject({
        message: ['You must use sorted keys to produce consistent hash'],
      });
    });

    let createdReport1;

    it.each([1, 2])(`PATCH /api/report 200 %i`, async () => {
      const result = await app.inject({
        method: 'PATCH',
        url: '/api/report',
        headers: {
          'Content-Type': 'text/plain',
        },
        payload: `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

{"background":"А жизнь как масло, а ты как сыр в жопе перепробовав всё говно, остаёшься вонять благородной плесенью","dateTimestamp":1678021709,"substances":[{"dose":10,"doseUnit":"mg","namePsychonautWikiOrg":"2C-I","routeOfAdministration":"insufflated","surePercent":95,"timeSecond":0},{"dose":10,"doseUnit":"mg","namePsychonautWikiOrg":"2C-I","routeOfAdministration":"insufflated","surePercent":95,"timeSecond":360}],"timeLineReport":[{"report":"Печёт пиздец","timeSecond":0},{"report":"Ну что-то вроде есть","timeSecond":300},{"report":"Душевная лёгкость, вкус чая будто тает во рту, свет стал ламповым, атмосфера отдаёт пленящим теплом","timeSecond":600}],"title":"Вечерний променад"}
${reports.signatureArmored1}`,
      });
      expect(result.statusCode).toEqual(200);
      const json = result.json();
      expect(json).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(String),
        d: JSON.parse(reports.ok1),
        signature: {
          id: expect.any(String),
          createdAt: expect.any(String),
          signedAt: '2023-05-13T18:15:33.000Z',
          primaryKeyFingerprint: '05F9ED8812AA8CD52A716B24AAE6AD94022ABBF1',
          hash: ['SHA512'],
          usedKeyFingerprint: '05F9ED8812AA8CD52A716B24AAE6AD94022ABBF1',
          signature:
            '471E2F268DF68089C0B46EEB4F950B033F89C3ABAD093D8DE16F0DAE18999F6EDA55DF750A7433F9396108648DD9EBFB6FE383665A41CA3F0768520434E6CFCBE93A48BEC732A9009FB8039F4753A6972E9649298BC72FCC3D7D8AE73ADB1D7135C0707AD2F133C4D23834495D8CDB722AB0B9D705A29F36C8550525111A28BF9C2AEE05213BDADB935F067ECB9E63313356C97A49EB1E49C1E45E6A8E0204763B52CFC09ED1A68581811EDF13101862C109CE9B041DE2AEA1B6F2DC8AEB87487B24685750CEA5C16AAC9A6813F6B8B259CADB84679E3352551D8434373EC42068244396A6387F35F347A731771642408CDB1EEC4F51B901D4B2BFB7CDB7F4CC7EC5135EDD14CA134EF464A8CF37A3B77536826AEF2C93BC43D013F6734D1FD9B1A9133C14D43A15D445868988F45522784E1D5E2931CD2C7FB5CBC456BCD59ED487E8EFE3DD1FA1787B6BB92C3E9D7B88629FA57C5AC5406A5510A68105289CBEC3127CCF7BBC8AB247A2A8A5E18106128F2F727A8685B983A245313B83EE48B2D646745EC0BE875FAB5ACBE41DD6E13705CCBD99441C2B13D90DF047C0C076B39B34B54E9347AE4E1260EF3147CC2A0A5C0AD3BE37FBB01071BF6B0A26D5F1725B40754393278DA1080CF8E30A03DEAC51471839155FABE257A57729027B1973374399AF8E41AC854FBEC35F6D0B95D399FA90CD50BDDC0263F42516B48D38',
          user: {
            id: createdUser.id,
            nick: createdUser.nick,
          },
        },
      });
      createdReport1 = json;
    });

    it(`GET /api/report/:id`, async () => {
      const result = await app.inject({
        method: 'GET',
        url: `/api/report/${createdReport1.id}`,
      });
      expect(result.statusCode).toEqual(200);
      const json = result.json();
      expect(json).toMatchObject({
        id: createdReport1.id,
        createdAt: expect.any(String),
        d: JSON.parse(reports.ok1),
        signature: {
          id: expect.any(String),
          createdAt: createdReport1.createdAt,
          signedAt: '2023-05-13T18:15:33.000Z',
          primaryKeyFingerprint: '05F9ED8812AA8CD52A716B24AAE6AD94022ABBF1',
          hash: ['SHA512'],
          usedKeyFingerprint: '05F9ED8812AA8CD52A716B24AAE6AD94022ABBF1',
          signature:
            '471E2F268DF68089C0B46EEB4F950B033F89C3ABAD093D8DE16F0DAE18999F6EDA55DF750A7433F9396108648DD9EBFB6FE383665A41CA3F0768520434E6CFCBE93A48BEC732A9009FB8039F4753A6972E9649298BC72FCC3D7D8AE73ADB1D7135C0707AD2F133C4D23834495D8CDB722AB0B9D705A29F36C8550525111A28BF9C2AEE05213BDADB935F067ECB9E63313356C97A49EB1E49C1E45E6A8E0204763B52CFC09ED1A68581811EDF13101862C109CE9B041DE2AEA1B6F2DC8AEB87487B24685750CEA5C16AAC9A6813F6B8B259CADB84679E3352551D8434373EC42068244396A6387F35F347A731771642408CDB1EEC4F51B901D4B2BFB7CDB7F4CC7EC5135EDD14CA134EF464A8CF37A3B77536826AEF2C93BC43D013F6734D1FD9B1A9133C14D43A15D445868988F45522784E1D5E2931CD2C7FB5CBC456BCD59ED487E8EFE3DD1FA1787B6BB92C3E9D7B88629FA57C5AC5406A5510A68105289CBEC3127CCF7BBC8AB247A2A8A5E18106128F2F727A8685B983A245313B83EE48B2D646745EC0BE875FAB5ACBE41DD6E13705CCBD99441C2B13D90DF047C0C076B39B34B54E9347AE4E1260EF3147CC2A0A5C0AD3BE37FBB01071BF6B0A26D5F1725B40754393278DA1080CF8E30A03DEAC51471839155FABE257A57729027B1973374399AF8E41AC854FBEC35F6D0B95D399FA90CD50BDDC0263F42516B48D38',
          user: {
            id: createdUser.id,
            nick: createdUser.nick,
          },
          block: {
            id: expect.any(String),
            createdAt: expect.any(String),
            type: 'PGP SIGNATURE',
            blockArmored: reports.signatureArmored1,
          },
          data: {
            id: expect.any(String),
            createdAt: expect.any(String),
            clearSignDataPart: reports.ok1,
            mime: 'application/json',
            sha256:
              'f39e378ece0f8514b61b5d6d4acaaa300c709f5f5cb351c5627aa9ff0b55d712',
            type: 'drugs.ero-like.online/report@0.0.1-alpha-1',
          },
          publicKey: {
            id: expect.any(String),
            createdAt: '2022-07-25T15:41:50.000Z',
            invalidAt: null,
            block: {
              blockArmored: users.tomfun.publicKeyArmored,
              createdAt: expect.any(String),
              id: expect.any(String),
            },
          },
        },
      });
    });

    it.each([
      [`page=0`, 1],
      [`page=0&signature[user][nick][endsWith]=Kotov`, 1],
      [
        `page=0&signature[user][nick][endsWith]=Kotov&signature[user][nick][startsWith]=H`,
        1,
      ],
      [
        `page=0&signature[user][nick][endsWith]=Kotov&signature[user][nick][startsWith]=H&d[title][startsWith]=Вечерний`,
        1,
      ],
      [
        `page=0&signature[user][nick][endsWith]=Kotov&signature[user][nick][startsWith]=H&d[title][startsWith]=Вечерний&d[substances.*.namePsychonautWikiOrg][contains]=2C-I`,
        1,
      ],
      [
        `page=0&signature[user][nick][endsWith]=Kotov&signature[user][nick][startsWith]=H&d[title][startsWith]=Вечерний&d[substances.*.namePsychonautWikiOrg][contains]=2C-`,
        1,
      ],
      [
        `page=0&signature[user][nick][endsWith]=Kotov&signature[user][nick][startsWith]=H&d[title][startsWith]=Вечерний&d[substances.*.namePsychonautWikiOrg][contains]=2Ck`,
        0,
      ],
      [
        `page=0&signature[user][nick][endsWith]=Kotov&signature[user][nick][startsWith]=H&d[title][startsWith]=Вечерний&d[substances.*.namePsychonautWikiOrg][contains]=2C-B`,
        0,
      ],
      [
        `page=0&signature[user][nick][endsWith]=Kotov&signature[user][nick][startsWith]=H&d[title][startsWith]=ВечерниЁ`,
        0,
      ],
      [
        `page=0&signature[user][nick][endsWith]=Kotov&signature[user][nick][startsWith]=R`,
        0,
      ],
      [`page=0&signature[user][nick][endsWith]=Greg`, 0],
    ])(`GET /api/report?%s 200`, async (q, length) => {
      const result = await app.inject({
        method: 'GET',
        url: `/api/report`,
        query: q,
      });
      console.log(length);
      expect(result.statusCode).toEqual(200);
      const json = result.json();
      expect(json).toMatchObject({
        itemsTotal: length,
        page: 0,
        pageSize: 10,
      });
      expect(json.items).toHaveLength(length);
      if (length === 0) {
        return;
      }
      expect(json.items[0]).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(String),
        d: JSON.parse(reports.ok1),
        signature: {
          signedAt: '2023-05-13T18:15:33.000Z',
          user: {
            id: createdUser.id,
            nick: createdUser.nick,
          },
        },
      });
    });
  });
});
