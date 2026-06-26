import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DIRECT_URL!

// El truco está aquí: Supabase exige conexión segura (SSL) cuando usamos la librería 'pg'
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // ¡Este es el pase VIP!
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Empezando a sembrar datos... 🌱')

  const verduras = await prisma.category.create({
    data: { name: 'Verduras' }
  })

  const frutas = await prisma.category.create({
    data: { name: 'Frutas' }
  })

  await prisma.product.createMany({
    data: [
      {
        name: 'Tomate Chonto',
        description: 'Tomate rojo fresco ideal para guisos.',
        price: 2500,
        measureUnit: 'POUND',
        categoryId: verduras.id,
      },
      {
        name: 'Cebolla Cabezona',
        description: 'Cebolla blanca limpia.',
        price: 1800,
        measureUnit: 'POUND',
        categoryId: verduras.id,
      },
      {
        name: 'Manzana Verde',
        description: 'Manzana importada crujiente.',
        price: 3500,
        measureUnit: 'UNIT',
        categoryId: frutas.id,
      }
    ]
  })

  console.log('¡Supermercado surtido con éxito! 🛒✨')
}

main()
  .catch((e) => {
    console.error("Hubo un error en la inyección:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })