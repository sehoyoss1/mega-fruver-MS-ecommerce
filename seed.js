require('dotenv').config();
const { PrismaClient } = require('@prisma/client')

// Usamos la nueva propiedad "datasourceUrl" que exige Prisma 7
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'tu_clave_segura',
      role: 'ADMIN',
    },
  })
  console.log('Usuario Admin creado:', admin)
}

main()