import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as process from 'process';
import { ReportModule } from './report.module';

async function bootstrap() {
  const app = await NestFactory.create(
    ReportModule,
    new FastifyAdapter({ trustProxy: +process.env.TRUST_PROXY }),
  );
  await app.listen(+process.env.PORT, process.env.ADDRESS);
}
bootstrap();
