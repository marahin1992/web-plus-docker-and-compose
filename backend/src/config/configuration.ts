export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
  },
  database: {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    name: process.env.POSTGRES_DB || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
  },
  jwt: {
    secret: process.env.PRIVATE_KEY || 'secret',
    ttl: process.env.JWT_TTL || '30000s',
  },
});
