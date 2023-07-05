import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoreModule } from '../core/core.module'
import { entities } from '../entity'
import { PsychonautWikiService } from './psychonaut-wiki.service'
import { ReportController } from './report.controller'
import { PsychonautWikiController } from './psychonaut-wiki.controller'
import { ReportService } from './report.service'

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature(entities)],
  controllers: [ReportController, PsychonautWikiController],
  providers: [ReportService, PsychonautWikiService],
})
export class ReportModule {}
