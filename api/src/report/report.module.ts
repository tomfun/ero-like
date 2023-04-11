import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { entities } from '../entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature(entities)],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
