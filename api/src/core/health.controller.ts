import { Controller, Get } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators'
import { DataSource } from 'typeorm'
import { GpgService } from './gpg.service'

@Controller('/api/health')
export class HealthController {
  @InjectDataSource()
  private dataSource: DataSource

  constructor(private readonly gpgService: GpgService) {}

  @Get('/')
  async status() {
    await this.dataSource.manager.query('SELECT 1+1')
    return this.gpgService.version()
  }
}
