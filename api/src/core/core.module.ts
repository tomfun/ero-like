import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { entities } from '../entity'
import { GpgService } from './gpg.service'
import { HealthController } from './health.controller'
import { SignatureDataService } from './signature-data.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [UserController, HealthController],
  providers: [GpgService, SignatureDataService, UserService],
  exports: [GpgService, SignatureDataService, UserService],
})
export class CoreModule {}
