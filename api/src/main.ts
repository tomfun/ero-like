import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as process from 'process';
import * as qs from 'qs';
import { ReportModule } from './report.module';
import Server from 'fastify';

async function bootstrap() {
  const server = Server({
    // @see https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
    trustProxy: +process.env.TRUST_PROXY,
    logger: true,
    querystringParser: (str) => qs.parse(str),
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    ReportModule,
    new FastifyAdapter(server),
  );
  await app.listen(+process.env.PORT, process.env.ADDRESS);
}
bootstrap();
