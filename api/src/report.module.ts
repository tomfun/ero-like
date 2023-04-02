import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entity';
import { dataSourceOptions } from './datasource';
import { GpgService } from './gpg.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { SignatureDataService } from './signature-data.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [ReportController, UserController],
  providers: [ReportService, GpgService, SignatureDataService, UserService],
})
export class ReportModule {}
