import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const prismaClientSingleton = () => {
  console.log('[packages/db/index.ts] DATABASE_URL before PrismaClient init:', process.env.DATABASE_URL); // Added for debugging
  return new PrismaClient({
    // Add explicit log levels for better debugging
    log: ['error', 'warn'],
    // Explicitly set the data source URL so the client can find it
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma