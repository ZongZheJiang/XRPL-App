// utils/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { createServer } from './supabaseServer'
import { cookies } from 'next/headers'

export async function updateSession(request: NextRequest) {
  // This response object will be passed through the middleware chain
  // and will be used to set cookies.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client configured to use cookies
  const supabase = createServer()

  // IMPORTANT: This will refresh the user's session if it's expired.
  // It also populates `request.auth` with the user's session info.
  const { data: { user } } = await supabase.auth.getUser()

  return { supabase, user, response }
}