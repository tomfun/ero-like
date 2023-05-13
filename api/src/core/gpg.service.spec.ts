import { Test, TestingModule } from '@nestjs/testing';
import { GpgService } from './gpg.service';

describe('AppController', () => {
  let gpgService: GpgService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [GpgService],
    }).compile();

    gpgService = app.get<GpgService>(GpgService);
  });

  it('temporaryImportAndVerify should return proper keys rsa 9E13AD316FB3A47D', async () => {
    const clearSignArmored = {
      hash: 'SHA512',
      clear:
        'I read and agree with all terms of use of ero-like and confirm my registration on ero-like',
      signBlock:
        '-----BEGIN PGP SIGNATURE-----\n\niQIzBAEBCgAdFiEEBfntiBKqjNUqcWskquatlAIqu/EFAmQCVw8ACgkQquatlAIq\nu/GJRw//fpu1Y0FqfN1HITc+hnUvptoWT8i98dF2RFBIyinly+KvgHSQJHjUr1Ks\njNgw+BHMkj9weG2VVH5xGNUrP3j7GYKIUAnniDBLUm1HE/XDq2mSCzc0cpX7reGy\nuhK4RFKykBIe2oF8PElNBfl/iTofcDNU6CVAfvGhpa+yX5GCrgF2UF7mSfYJqAAx\nbqWAtUUfKOS9eDtlmSI618kKF7Fz936sYKfThjiKJ9W8leF7BHt+4bVa0mLY4r65\nqSX9yUwDNB9q1QzDylM/jEmcXtD9Nf87wOXUh7omlOQmUozDnTX8IJiws+ImPipG\nPpFTvhSFmDHm+8oDWkj27I1ZfdQDI8GWpzXkIQwTUheZZiIainZ8Zce2otaf0d0J\nb3sQm+eIf+NPKcMelMqNrByriY9WJRbqNSTn5G20qWBq7fsxXPDvxRy+taGdctQi\nGkh84VlfF8+/q8/P5NCx8DJgmKU/HctB/Ns8aHTmZCf4Fm0R5yCU9tozVoaUyqw+\n2vFA2Qmg0WEPXQs+inqIKw9UMH+oy4soHX3pSiXqv0Van9ysPvJ7x9nz2taI5XCA\nGc6PnN4QW6xZog/IsaoykiOFhW28hMXTMCYGvjbspWw4JtiqehzgyS8jY9nrToub\nQIdSswmBJN8Sp8eNQ9jjGAvJZOzhBBMnFD1NAkbTBJ4zZb02bbY=\n=PjF2\n-----END PGP SIGNATURE-----',
      signature:
        '7E9BB563416A7CDD4721373E86752FA6DA164FC8BDF1D176445048CA29E5CBE2AF8074902478D4AF52AC8CD830F811CC923F70786D95547E7118D52B3F78FB1982885009E788304B526D4713F5C3AB69920B37347295FBADE1B2BA12B84452B290121EDA817C3C494D05F97F893A1F703354E825407EF1A1A5AFB25F9182AE0176505EE649F609A800316EA580B5451F28E4BD783B6599223AD7C90A17B173F77EAC60A7D386388A27D5BC95E17B047B7EE1B55AD262D8E2BEB9A925FDC94C03341F6AD50CC3CA533F8C499C5ED0FD35FF3BC0E5D487BA2694E426528CC39D35FC2098B0B3E2263E2A463E9153BE14859831E6FBCA035A48F6EC8D597DD40323C196A735E4210C1352179966221A8A767C65C7B6A2D69FD1DD096F7B109BE7887FE34F29C31E94CA8DAC1CAB898F562516EA3524E7E46DB4A9606AEDFB315CF0EFC51CBEB5A19D72D4221A487CE1595F17CFBFABCFCFE4D0B1F0326098A53F1DCB41FCDB3C6874E66427F8166D11E72094F6DA33568694CAAC3EDAF140D909A0D1610F5D0B3E8A7A882B0F54307FA8CB8B281D7DE94A25EABF455A9FDCAC3EF27BC7D9F3DAD688E5708019CE8F9CDE105BAC59A20FC8B1AA32922385856DBC84C5D3302606BE36ECA56C3826D8AA7A1CE0C92F2363D9EB4E8B9B408752B3098124DF12A7C78D43D8E3180BC964ECE1041327143D4D0246D3049E3365BD366DB6',
    };
    const publicKeyArmored =
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\nyB2jQjJns1lWvQ==\n=qQ0g\n-----END PGP PUBLIC KEY BLOCK-----\n';
    const key1 = {
      publicKey0:
        'A7862A50B0D23632CC3F5810FC33AA31A411B6926319027AFDC5EEC7FF75BE92CB19E3A55D8933F44B534ABE9C3E78AEDC4EFDB1BEDF7B3EB786E2234531CE799505CB581A07E61AE9B8D0E31F405A14F0FE52CA43BAE88063D9D33F21B34024CE4D1B4A581AB2240B9A1F4FF1832AAD431637C8EC9AF98E0F933742C8FC9F3A18006E97D003CAAA7E8B924532791039570553A489D3E0DE64AE59349F81A5552064F88DAAD77352F8C7DC07BE576AA9F2CF42724DA24DD167314F918FC47A5BBBF320AEFFCA083B30226A0BBAE62A949F02A95731FBFBA4CB2FBE228CD86DA866BA67B9E302D62F68143E9CF11885443932C6F2FD90EB1B9D8504DAA3CB8262A05E20E864992ABF2141FABAA46712CE0690CF1CFC076AE59196BBF245E36F46962653B457837D7E3C83CFB941E75CBF60CE7BE57C535DEECD0326B05BA8409FC144E386EE0194E656586750BA893B00CE4ADA0797A8A5415B9E5F40E8486BC624344F2E96190C9D308E7479C5FFE78D32A2FE9E371094E8B7C25FC808056C7A292A13A1AE11D415D061582E0347D71479B194BEF1B4565369BE54F009E99D54649B13218DB3576E9ED2874A3838C6B9A3A6A219963BCFF38847D64B67B817E67822B7EA600ECBAB83A165BCC0AB55B3468FC7C0B0070555B3C34DD5CEB344FA75C112CD9A01BADACFAF5A0131AE0C12A88F8C866944D7D7CB427A059982ACA9',
      publicKey1: '010001',
      created: 1658763710,
      keyId: 'AAE6AD94022ABBF1',
      v4: '05F9ED8812AA8CD52A716B24AAE6AD94022ABBF1',
    };
    const key2 = {
      publicKey0:
        'F08EB42E8B574CE2F2B6729F785E939F945DA75A1B4BF6F8AEA6D9C8CA8EF7D78CE0D50CAAC520119A19C2A6302923BEE8EAF97C1A233B5517B13FBCAAE3DDDC033A884033170A4AE02197678E6FADA7AE0A455B355A153D2B305742B2A144F38DF38DFEE85BE68A7F07142D24AA5CF9C632628A98DC215848160C9819DDF1A5DE245B75D7B0A6937F2357E48AB360F472B237E72F98DC26A12BEEF1F557831DAEF2653EE0697EF98A74CBDC8E2FB2AB1605F7F5A3F42F96F80BC39A747C7611FF094F2AA25D4CB13CC6F4ABB926BB9CF8F7E40EE92176DCDE0437051321B46A80EB47BF25C1AA27C37A2370E03B684D2DFEFC4F2F9366496A391818B4DC5D0A34E08051ACDB44D18F0A31ED2E9F755564C9F7F54EE1FB05F5C45A45CA851A40EACE34B66B28508FD48BC13CE861DE3480CA1214003FD208EA9FCA4BD18E5C9E9A82E3FCDF5A2BF4516D8FDE578159F24D1BD6201094F4F60474D443E160E3889CFA5C9E711A3B842870BA7C4276EA3BE7EAAEAD6AD215A47DCDFA24236A3634B632B5560320580AC723BEF7558A6B308F6BD0F03DA4FF09FD44650BA132A73784BF554F806231D2C24A456673FF1F98C1D7150A7CD93CC2435ABF5D5309A4C76848675B1DACA793C88D225016F57426AFD9D4F207DB38F492245FC2C3CC65A8ABFE3A2DCE30EE89018EF6935BA7BC76ADB937B7A1632295F52DF1EC59E4B32D',
      publicKey1: '010001',
      created: 1658763710,
      keyId: '9E13AD316FB3A47D',
      v4: '1683A3A830F0FDDC09F713739E13AD316FB3A47D',
    };
    expect(
      await gpgService.temporaryImportAndVerify({
        clearSignArmored: `-----BEGIN PGP SIGNED MESSAGE-----\nHash: ${clearSignArmored.hash}\n\n${clearSignArmored.clear}\n${clearSignArmored.signBlock}`,
        publicKeyArmored,
      }),
    ).toStrictEqual({
      importedKeyUser: expect.stringMatching(
        /^Hryhorii \(Greg\) Kotov <gk@crosspay.net>|Grigory Kotov tomfun199@gmail.com$/,
      ),
      publicKeys: [
        {
          alg: '1',
          bits: '4096',
          type: '1-4096',
          capabilities: 'sc',
          created: new Date(key1.created * 1000),
          expires: null,
          keyid: key1.v4,
          shortKeyId: key1.keyId,
          publicKeyFingerprint: key1.v4,
          grp: 'AD56D2949027C8F93D0D292DF78F603ED8FCF89E',
          pkey: [key1.publicKey0, key1.publicKey1],
        },
        {
          alg: '1',
          bits: '4096',
          type: '1-4096',
          capabilities: 'e',
          created: new Date('2022-07-25T15:41:50.000Z'),
          expires: null,
          keyid: key2.v4,
          shortKeyId: key2.keyId,
          publicKeyFingerprint: key2.v4,
          grp: '8BBF7CDBE31F49EA09EDD823F397D97A41CC4159',
          pkey: [key2.publicKey0, key2.publicKey1],
        },
      ],
      revocatedUserKeys: [],
      signature: clearSignArmored.signature,
      signatureAlgorithm: '1',
      signatureData: {
        clearSignDataPart: clearSignArmored.clear,
        clearSignSignaturePart: clearSignArmored.signBlock,
        hash: [clearSignArmored.hash],
        primaryKeyFingerprint: key1.v4,
        usedKeyFingerprint: key1.v4,
        usedKeyType: 'RSA',
        signatureDate: new Date('2023-03-03T20:22:39.000Z'),
      },
    });
  });

  it('temporaryImportAndVerify should return proper keys 2C8AF92702763EE0 / DSA 1E11B59089A05C6B', async () => {
    const clearSignArmored = {
      hash: 'SHA256',
      clear:
        'I read and agree with all terms of use of ero-like and confirm my registration on ero-like',
      signBlock:
        '-----BEGIN PGP SIGNATURE-----\n\niHUEAREIAB0WIQRI9smM6nkaYkWBL24eEbWQiaBcawUCZAMpMAAKCRAeEbWQiaBc\na4RcAP0c2zfzNbBjfK5u28LPGwUAuuJ9U2mTWsFpvI2sH1PMNgEArgg0m340TVrS\nQuNTTKu/YOM52oBqw88JTss48+IAjnM=\n=UbrK\n-----END PGP SIGNATURE-----',
      signature1:
        '1CDB37F335B0637CAE6EDBC2CF1B0500BAE27D5369935AC169BC8DAC1F53CC36',
      signature2:
        'AE08349B7E344D5AD242E3534CABBF60E339DA806AC3CF094ECB38F3E2008E73',
    };
    const publicKeyArmored =
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\nYnVwv0HExONOngZ5Q1fQVYKA4yxDdN5qSIODBA==\n=cLep\n-----END PGP PUBLIC KEY BLOCK-----\n';
    const key1 = {
      publicKey0:
        'EE387B5845963F03AA657A917930D6425518C53BDB63F75A6FD0F2E8CFA30B7C921F971FAAB509371A9187C5808885C374C83EB8E02BA0B6BD963E4F9312025F27E6C15A311D33C909733B0D7F34D386765F95B25FDE6F414C915A83CF97CB01F965160F433BBF668853DD4732E0C0612B50E8B876D450115F81211829330CBED2BC9CE3CEDB5BD269591B8A7024FAC8C360BDA6A5C85C839A6678834FAC0881202FEEC0FBF9A2D59E135C65A11D0731E8A9818E48D78168BE17D757E878E29176AFE2CACE35118775C51BC37736A7553B6DF0442A7281821EF4EDD887E20011A5DDB10D201488C1EF2FABABB824C504DCCC5317BDF016F9A397AB24BF4C347E3BD9FBAEA7967D2402F8154A8976F562BCFBEC08BA47007DEA472871FD644A90F8C7798B859322BEFBFAE517D7031912E87FE682DFA1A08946C2D8DC1A6710BAF06319DE254874CC810C00C0A44E2F20BE8B2BE38D92AF25154A828987C07AA3D54178F9F8B30737C0E84E85E652377A5A9B9185824FC5123AE61A5AF1BEA41B',
      publicKey1: '010001',
      created: 1676223452,
      keyId: '2C8AF92702763EE0',
      v4: '5F5841BC0763CCF4EA39F7E02C8AF92702763EE0',
    };
    const key2 = {
      publicKey0:
        'B4C322DA60322F26A433B30D80E1ADCC43C5CE351070118B2885382D2F0C3C1EFFF4250AA5CD610B75608F3DFE398DDDEFC043049685B16CA469E11046285CD5F367D5C7CD7AA5FE68A6DB585DF8B501572D23DAB832D90555A54A8A49B253C47499C7AD4EE5A4BE3557AF873C608276AFB200DCE4DB28907855B868F2712BA9607ABE566A704236DF815D92981B7D4EF65BF99006114D2F40706D4BD53B8DC2A91C057D1F33E6FD58E89DE121B72D23ADAA188B5CA0DAB757755F898C5194712D0C3CA7DBAD6247D62B51B0385E4505C448593CB29494FB5E56740086EF03437C7BD8624AF3D942208A37F70C28AFF19D2CD7DCFE844EBCFB3457D6C12E98F6806453E4C81E8AE84328378D16EBF452AC4114F7C0BDC68799D63077D611D911AEC783AD81945633497A5F96E47CA39AEE4754835B7EE4C9A10D592DE2ED1D7E22206956700544CFDD0C147FD3AB7093756B311BD1632132B7AEF509AF18205F4FA802702E8450B2329307A2FCA613DF06D2932B38839936E7E3E4E1A7C2BE29',
      publicKey1: '010001',
      created: 1676223452,
      keyId: '47885479AE025E56',
      v4: 'D483440A10586781F8CB4E9A47885479AE025E56',
    };
    const key3 = {
      publicKey0:
        'C54F37029908884E02B59FE08A6AB2367496D4B15C7FA8739C058D3D332503DB47E78FF426279830B650848760C1F9646883A950133B273E2C6FB825C662DA3CBA665287920BBF6CADAFB7CEC8E0B70EB60CBBEAD54DBEE734C11289D2A4DD6FA70AF792CEE2ECEC8307B4CC587BEA3813D4D940A476F3C43488C93C80D3E099',
      publicKey1: '010001',
      created: 1676234220,
      expires: 1738442220,
      keyId: '16AC27C7C31F6127',
      v4: 'CAD198CC16DDB5B147EA0F2B16AC27C7C31F6127',
    };
    const key4 = {
      publicKey0:
        '8BBF87ADE0FE036CE572CFA39A3710C69DAEC644AC16C0374D72EF3D24A3AB855BBC11DC2FE30A9C7C33591D1FFA09518E8A1ABA941747E24A4A07FF14EDA984F3F002E3AB66426DA040AD0B980FB0987ED45B0080EAD98DB52FE80654BA994F5893879F83EABE6D95142880292A783D856EC982359424B100B2D10CD4F66B4066336A42BD15A710A89B7741BCCA335A351BBD69023AA093C389E1FC17602551BA01DC311DAE1AC7A92CAE1B2754148E6EDD826435B34523B0010E1A511D54AB188C1E9DF043C47FA8F743BB5E4425AAF6D65E5F4E46581F278D13723942BB749A84B50057D3BAA7CE2DADF5F7E2665B3DD867E7596B1C351C8B262DFEBAD227D41CF227CFB7C4D99EB4AB5FC2A064B9EF51F3F54478A244FDF4035ACA1110A17BC97BBC1FFF37B62B764F3D3802ACCB2D1B9A474FA5CF6C391B4270A9DBD0253CF7B43DD4887B8DB67F5D678858BCE36E045C66280C3430B5D2CC108957B5F76A3457B0119D4ACE0963202DD066835E060239FEE32541DFF39D8700A8906D4F',
      publicKey1:
        'E1A4FC8D47AACC89617E8159466265EDBBD96431B88EDE6FE2A283E89139CC6B',
      publicKey2:
        '0ED2F9E46AC3F0EBD9CAA6A471D6AA8AD83DC3CD39450CF4C8DF6718535A2D2A4804FA3D36BE00B843DC61FC1C0184CC1A9B21573E5FE1112AAD769A295A80E1AC27D602C046E51A830960A0F196BF28E0A8032016A65BC91F86A35D7FED731C5D1E21C4E793C71790708A595E134669A42C51286B29B0F1539399ABFFEEC620A5AB6A6211B1F8D95CF2197D178A15BE7D3718C7B00CBDDE1CF0AFB341D9FDF2B869066E71B36A98C5A6F11F0A179B8AEB20AFEE9F174FBF6835A9BC2C760F8FE271DCAFBDAD0CDD1871688D788EA7ABFDCF3F3AF637A011385040C1D9D5B4DBBC8A4363ABA724CFF72457381C6D5AEA1073DC9C33862474C3B177025268CA1045BFE34B2430DD50DA04CE3BF1689A3081E978A638DC5A8D2BB7480A436A4DF997D0F269CEABABD624AAA1CA12A17803FD473D7F9536A18DE4633D3F21422D751602E4E4A2B67EB2E4BBAC01953229198D1C167A9A4E1CD4DEB0A8E4224FBEFC32D651F2887AE1BCD6E1B75915112548A4072751B3041F977E94F69E4FF2DA6E',
      publicKey3:
        '53D75C2B66AC04F2A7C96FE04019BE2A664A79DEA0A389632D46445DBC798EB4DDC4333F29C2F262A4A28E359E7609D93A3FEC01033C831411E31122E00068A434FC1689355502B53EC70AF050E10CF97FBDC87D0518CACDA605816678C9E47F39DDD77D588D1F1DF52F2BF1AC5A9DF200DDEDC9DFCFC6A536C050566B556D8CE739DDFF524D9A6579AFEC14AB83BF11FBA9FC32873BBB16D6051BBBA63E13751D7E6E77EE898B567B9BFFEFEAA010BBB775D81C721232F9656BF97710CF7D80364CF762905A55E1E2164921655C215DC6CB03D6AA9E754DF230EC38345E2B513CA56DA9CBD25995D9C31B2DF16C335CB560D7127C272DE1544D5690A64274B01F33DAFE6AD5D07AA92FADAFB02D0B8CFE4C930C3598F6B5F5D4107F22B4B9A1C3BECC7B143CF8D82018921BEE9E23A3CA20775495F77216FD721E47E3BD4769270ED023288E20F05C17845DEC3C9AC1ED28D3AC616A7B96EDEC139BA844DD1995BBE52EEE8B7E7D7AD6E8EA267FAB29787604CACB6D8C034C08451557AF0224',
      created: 1677928584,
      expires: 1680347784,
      keyId: '1E11B59089A05C6B',
      v4: '48F6C98CEA791A6245812F6E1E11B59089A05C6B',
    };
    expect(
      await gpgService.temporaryImportAndVerify({
        clearSignArmored: `-----BEGIN PGP SIGNED MESSAGE-----\nHash: ${clearSignArmored.hash}\n\n${clearSignArmored.clear}\n${clearSignArmored.signBlock}`,
        publicKeyArmored,
      }),
    ).toStrictEqual({
      importedKeyUser: expect.stringMatching(/^test1 \(comment\) <t@e.com>$/),
      publicKeys: [
        {
          alg: '1',
          bits: '3072',
          type: '1-3072',
          capabilities: 'sc',
          created: new Date(key1.created * 1000),
          expires: null,
          keyid: key1.v4,
          shortKeyId: key1.keyId,
          publicKeyFingerprint: key1.v4,
          grp: 'F65F21E2D671FC1A1EB7BFC3E57F3681166F1EA8',
          pkey: [key1.publicKey0, key1.publicKey1],
        },
        {
          alg: '1',
          bits: '3072',
          type: '1-3072',
          capabilities: 'e',
          created: new Date(key2.created * 1000),
          expires: null,
          keyid: key2.v4,
          shortKeyId: key2.keyId,
          publicKeyFingerprint: key2.v4,
          grp: 'CA208C273B83B364D9491031062C2DF107C137C6',
          pkey: [key2.publicKey0, key2.publicKey1],
        },
        {
          alg: '1',
          bits: '1024',
          type: '1-1024',
          capabilities: 's',
          created: new Date(key3.created * 1000),
          expires: new Date(key3.expires * 1000),
          keyid: key3.v4,
          shortKeyId: key3.keyId,
          publicKeyFingerprint: key3.v4,
          grp: '8CBE5423AF5C05D7553C9E6FFF0DF3543CD713CF',
          pkey: [key3.publicKey0, key3.publicKey1],
        },
        {
          alg: '17',
          bits: '3072',
          type: '17-3072',
          capabilities: 's',
          created: new Date(key4.created * 1000),
          expires: new Date(key4.expires * 1000),
          keyid: key4.v4,
          shortKeyId: key4.keyId,
          publicKeyFingerprint: key4.v4,
          grp: 'D15771B83744E5DBCC73DEA632DB60017B14545E',
          pkey: [
            key4.publicKey0,
            key4.publicKey1,
            key4.publicKey2,
            key4.publicKey3,
          ],
        },
      ],
      revocatedUserKeys: [],
      signature: clearSignArmored.signature1 + clearSignArmored.signature2,
      signatureAlgorithm: '17',
      signatureData: {
        clearSignDataPart: clearSignArmored.clear,
        clearSignSignaturePart: clearSignArmored.signBlock,
        hash: [clearSignArmored.hash],
        primaryKeyFingerprint: key1.v4,
        usedKeyFingerprint: key4.v4,
        usedKeyType: 'DSA',
        signatureDate: new Date(1677928752 * 1000),
      },
    });
  });

  it('temporaryImportAndVerify should return proper keys 2C8AF92702763EE0 / RSA 16AC27C7C31F6127 and notation', async () => {
    const clearSignArmored = {
      hash: 'SHA512',
      clear:
        'I read and agree with all terms of use of ero-like and confirm my registration on ero-like',
      signBlock:
        '-----BEGIN PGP SIGNATURE-----\n\niNYEAQEKAEAWIQTK0ZjMFt21sUfqDysWrCfHwx9hJwUCZANXgCIUgAAAAAAUAAVu\nYW1lQGVyby1saWtlLm9ubGluZXZhbHVlAAoJEBasJ8fDH2EnTC0D/i9l3MZYm2We\nujndCA0A0AeHR/1FubTX/bYa1ACBinJzy4yxhMBxiwgb4YhJZ76suKYkLWuK9ZL+\nGlcTj8Ndwk+NwacQFvV6IhtGRJfthhuXxKuMDLNIcRGXsqQG/i+8Ws/jR2n6/TCP\nO30aQz2ZH2Izjp4egZZbsqS3Dai6Xrb0\n=RlnD\n-----END PGP SIGNATURE-----\n',
      signature:
        '2F65DCC6589B659EBA39DD080D00D0078747FD45B9B4D7FDB61AD400818A7273CB8CB184C0718B081BE1884967BEACB8A6242D6B8AF592FE1A57138FC35DC24F8DC1A71016F57A221B464497ED861B97C4AB8C0CB348711197B2A406FE2FBC5ACFE34769FAFD308F3B7D1A433D991F62338E9E1E81965BB2A4B70DA8BA5EB6F4',
    };
    const publicKeyArmored =
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\nYnVwv0HExONOngZ5Q1fQVYKA4yxDdN5qSIODBA==\n=cLep\n-----END PGP PUBLIC KEY BLOCK-----\n';
    const key1 = {
      publicKey0:
        'EE387B5845963F03AA657A917930D6425518C53BDB63F75A6FD0F2E8CFA30B7C921F971FAAB509371A9187C5808885C374C83EB8E02BA0B6BD963E4F9312025F27E6C15A311D33C909733B0D7F34D386765F95B25FDE6F414C915A83CF97CB01F965160F433BBF668853DD4732E0C0612B50E8B876D450115F81211829330CBED2BC9CE3CEDB5BD269591B8A7024FAC8C360BDA6A5C85C839A6678834FAC0881202FEEC0FBF9A2D59E135C65A11D0731E8A9818E48D78168BE17D757E878E29176AFE2CACE35118775C51BC37736A7553B6DF0442A7281821EF4EDD887E20011A5DDB10D201488C1EF2FABABB824C504DCCC5317BDF016F9A397AB24BF4C347E3BD9FBAEA7967D2402F8154A8976F562BCFBEC08BA47007DEA472871FD644A90F8C7798B859322BEFBFAE517D7031912E87FE682DFA1A08946C2D8DC1A6710BAF06319DE254874CC810C00C0A44E2F20BE8B2BE38D92AF25154A828987C07AA3D54178F9F8B30737C0E84E85E652377A5A9B9185824FC5123AE61A5AF1BEA41B',
      publicKey1: '010001',
      created: 1676223452,
      keyId: '2C8AF92702763EE0',
      v4: '5F5841BC0763CCF4EA39F7E02C8AF92702763EE0',
    };
    const key3 = {
      publicKey0:
        'C54F37029908884E02B59FE08A6AB2367496D4B15C7FA8739C058D3D332503DB47E78FF426279830B650848760C1F9646883A950133B273E2C6FB825C662DA3CBA665287920BBF6CADAFB7CEC8E0B70EB60CBBEAD54DBEE734C11289D2A4DD6FA70AF792CEE2ECEC8307B4CC587BEA3813D4D940A476F3C43488C93C80D3E099',
      publicKey1: '010001',
      created: 1676234220,
      expires: 1738442220,
      keyId: '16AC27C7C31F6127',
      v4: 'CAD198CC16DDB5B147EA0F2B16AC27C7C31F6127',
    };
    expect(
      await gpgService.temporaryImportAndVerify({
        clearSignArmored: `-----BEGIN PGP SIGNED MESSAGE-----\nHash: ${clearSignArmored.hash}\n\n${clearSignArmored.clear}\n${clearSignArmored.signBlock}`,
        publicKeyArmored,
      }),
    ).toStrictEqual({
      importedKeyUser: expect.stringMatching(/^test1 \(comment\) <t@e.com>$/),
      publicKeys: expect.any(Array),
      revocatedUserKeys: [],
      signature: clearSignArmored.signature,
      signatureAlgorithm: '1',
      signatureData: {
        clearSignDataPart: clearSignArmored.clear,
        clearSignSignaturePart: clearSignArmored.signBlock,
        hash: [clearSignArmored.hash],
        primaryKeyFingerprint: key1.v4,
        usedKeyFingerprint: key3.v4,
        usedKeyType: 'RSA',
        signatureDate: new Date(1677940608 * 1000),
      },
    });
  });

  it('temporaryImportAndVerify should return proper keys 02C0F331C1E6D84A EDDSA ed25519', async () => {
    const clearSignArmored = {
      hash: 'SHA256',
      clear:
        'I read and agree with all terms of use of ero-like and confirm my registration on ero-like',
      signBlock:
        '-----BEGIN PGP SIGNATURE-----\n\niHUEARYIAB0WIQQ2OqVjx0BwnTB75tMCwPMxwebYSgUCZAOyrQAKCRACwPMxwebY\nSkvGAQDoYaZNH5KPvQejUYB/7yOW+IJx+ywdblnHK5mJpSAhOQD+NGJEYXaaeIP1\nz2Q+Aic7wHjlaRfeaVd+EKiU8NT0gw4=\n=o6CA\n-----END PGP SIGNATURE-----\n',
      signature1:
        'E861A64D1F928FBD07A351807FEF2396F88271FB2C1D6E59C72B9989A5202139',
      signature2:
        '34624461769A7883F5CF643E02273BC078E56917DE69577E10A894F0D4F4830E',
    };
    const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZAOyXRYJKwYBBAHaRw8BAQdAO+MNPvSoIaXLzRDevNHKBuzL8nW4MTOFTrTu
+vOR46m0CyAodGVzdCBlY2MpiJAEExYIADgWIQQ2OqVjx0BwnTB75tMCwPMxwebY
SgUCZAOyXQIbAwULCQgHAgYVCgkICwIEFgIDAQIeAQIXgAAKCRACwPMxwebYShND
AP9rgWbq0zo4ccie3qm3PEEuow8Cqg50IvSPQYVO+yXRdQD+PUzH+PN37xuX+iBw
UKvfP8YZObmJQsuQ+a92TW6dZwM=
=5VUn
-----END PGP PUBLIC KEY BLOCK-----
`;
    const key1 = {
      publicKey0: '092B06010401DA470F01', // ed25519 (1.3.6.1.4.1.11591.15.1)
      publicKey1:
        '403BE30D3EF4A821A5CBCD10DEBCD1CA06ECCBF275B83133854EB4EEFAF391E3A9',
      created: 1677963869,
      keyId: '02C0F331C1E6D84A',
      v4: '363AA563C740709D307BE6D302C0F331C1E6D84A',
    };
    expect(
      await gpgService.temporaryImportAndVerify({
        clearSignArmored: `-----BEGIN PGP SIGNED MESSAGE-----\nHash: ${clearSignArmored.hash}\n\n${clearSignArmored.clear}\n${clearSignArmored.signBlock}`,
        publicKeyArmored,
      }),
    ).toStrictEqual({
      importedKeyUser: ' (test ecc)',
      publicKeys: [
        {
          alg: '22',
          bits: '255',
          type: '22-255',
          capabilities: 'sc',
          created: new Date(key1.created * 1000),
          expires: null,
          keyid: key1.v4,
          shortKeyId: key1.keyId,
          publicKeyFingerprint: key1.v4,
          grp: 'A956B2FD9879944E1C5DCF1A900306A64E47ADEA',
          pkey: [key1.publicKey0, key1.publicKey1],
        },
      ],
      revocatedUserKeys: [],
      signature: clearSignArmored.signature1 + clearSignArmored.signature2,
      signatureAlgorithm: '22',
      signatureData: {
        clearSignDataPart: clearSignArmored.clear,
        clearSignSignaturePart: clearSignArmored.signBlock,
        hash: [clearSignArmored.hash],
        primaryKeyFingerprint: key1.v4,
        usedKeyFingerprint: key1.v4,
        usedKeyType: 'EDDSA',
        signatureDate: new Date(1677963949 * 1000),
      },
    });
  });
});
