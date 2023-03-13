import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataEntity } from './data.entity';
import { dataSourceOptions } from './datasource';
import { GpgService } from './gpg.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { SignatureEntity } from './signature.entity';
import { UserController } from './user.controller';
import { ReportEntity } from './report.entity';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([
      UserEntity,
      ReportEntity,
      DataEntity,
      SignatureEntity,
    ]),
  ],
  controllers: [ReportController, UserController],
  providers: [ReportService, GpgService, UserService],
})
export class ReportModule {}
