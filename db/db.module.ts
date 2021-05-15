import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entity/Document';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  exports: [TypeOrmModule],
})
export class DbModule {}
