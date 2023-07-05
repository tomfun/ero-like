import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { entities } from '../entity'
import { GpgService } from './gpg.service'
import { SignatureDataService } from './signature-data.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [UserController],
  providers: [GpgService, SignatureDataService, UserService],
  exports: [GpgService, SignatureDataService, UserService],
})
export class CoreModule {}
