import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './datasource';
import { GpgService } from './gpg.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
  controllers: [ReportController, UserController],
  providers: [ReportService, GpgService],
})
export class ReportModule {}
