import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as process from 'process';
import { ReportModule } from './report.module';
import Server from 'fastify';
import fastifyRawBody from 'fastify-raw-body';

async function bootstrap() {
  const querystring = require('querystring');
  const server = Server({
    // @see https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
    trustProxy: +process.env.TRUST_PROXY,
    logger: true,
    querystringParser: str => querystring.parse(),
  });
  server.register(fastifyRawBody, {
    global: false, // add the rawBody NOT to every request. **Default true**
    // encoding: false, //Buffer; **Default utf8**
    runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
    routes: ['/webhook/:gw'],
  });
  const app = await NestFactory.create<NestFastifyApplication>(ReportModule, new FastifyAdapter(server));
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
