module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'pass',
  database: process.env.POSTGRES_DB || 'postgres',
  synchronize: false,
  logging:
    'POSTGRES_LOGGING' in process.env ? !!process.env.POSTGRES_LOGGING : true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migration/**/*.{ts,js}'],
  subscribers: ['dist/**/subscriber/**/*.{ts,js}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
