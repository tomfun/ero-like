import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { DataEntity as DataEntityInner } from 'ero-like-sdk/dist/data.entity'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { TransformBufferToString } from '../helper'

@Entity('data')
export class DataEntity extends DataEntityInner {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  declare id: string

  @ApiProperty()
  @Expose()
  @CreateDateColumn()
  declare createdAt: Date

  @Column()
  declare type: string

  @Column()
  declare mime: string

  @ApiProperty()
  @Expose()
  @TransformBufferToString
  @Column({ type: 'bytea' })
  declare sha256: string

  @ApiProperty()
  @Expose()
  @Column({ type: 'text' })
  declare clearSignDataPart: string
}
