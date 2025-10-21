import { Pool } from 'pg'

export function CreatePool(): Pool {
  return new Pool({
    user: process.env.POSTGRES_USER!,
    host: process.env.DATABASE_HOST!,
    database: process.env.POSTGRES_DB!,
    password: process.env.POSTGRES_PASSWORD!,
    port: Number(process.env.DATABASE_PORT!),
  })
}
