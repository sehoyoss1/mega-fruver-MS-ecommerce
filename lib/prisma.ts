import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Configuramos el adaptador seguro
const connectionString = process.env.DIRECT_URL!
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // Nuestro pase VIP
})
const adapter = new PrismaPg(pool)

// 2. Mantenemos la buena práctica de Next.js para no saturar la base de datos
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 3. Le pasamos el adaptador al cliente
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma