
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.APIKEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan SUPABASE_URL o APIKEY en las variables de entorno')
}


const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase