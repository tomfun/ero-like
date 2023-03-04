import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 'POSTGRES_PORT' in process.env ? +process.env.POSTGRES_PORT : 5432,
  username: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'pass',
  database: process.env.POSTGRES_DB || 'postgres',
  synchronize: false,
  logging:
    'POSTGRES_LOGGING' in process.env ? !!process.env.POSTGRES_LOGGING : true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migration/**/*.{ts,js}'],
};
export const dataSource = new DataSource(dataSourceOptions);
