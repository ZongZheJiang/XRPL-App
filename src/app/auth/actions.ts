// app/auth/actions.ts
'use server'

import { createServer } from '../../lib/supabaseServer'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = createServer()
  await supabase.auth.signOut()
  return redirect('/')
}