// /src/lib/supabaseClient.ts

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

const client = createBrowserClient(supabaseUrl, supabasePublishableKey)
export default client