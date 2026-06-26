import { createClient } from '@supabase/supabase-js'

// 1. Ponemos tu URL directamente para que no haya margen de error
const supabaseUrl = "https://xrmxtqifvfmgkdpmnvum.supabase.co"

// 2. Traemos la llave. Si el .env vuelve a fallar, simplemente reemplaza las comillas
// del final ("") por tu llave sb_publishable_... larguísima.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseKey)