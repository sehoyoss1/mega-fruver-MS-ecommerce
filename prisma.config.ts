// ESTO ES LO MÁS IMPORTANTE: dotenv debe ir arriba de todo
import 'dotenv/config' 
import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    // Aquí estamos llamando a tu variable del .env
    url: process.env.DIRECT_URL,
  },
})