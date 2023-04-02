import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule } from '@ntegral/nestjs-sentry';

import { strictConfigForRoot } from './app.module-config';
import { AppSchema } from './app.schema';
import { CoreModule } from './core/core.module';
import { entities } from './entity';
import { config as typeOrmConfig } from './pg.config-factory';
import { ReportModule } from './report/report.module';

@Module({})
export class AppModule {
  static forConfig(config: AppSchema): DynamicModule {
    return {
      module: AppModule,
      imports: [
        CoreModule,
        ReportModule,
        strictConfigForRoot,
        SentryModule.forRoot({
          enabled: !config.sentryDisable,
          dsn: config.sentryDsn,
          debug: false,
          environment: config.ENVIRONMENT,
          release: `api@${config.VERSION}`,
          close: { enabled: true },
        }),
        TypeOrmModule.forRoot(typeOrmConfig(config)),
        TypeOrmModule.forFeature(entities),
      ],
      providers: [],
    };
  }
}
