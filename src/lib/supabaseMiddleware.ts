import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client that can read and write cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request and response
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request and response
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Get the current user session
  const { data: { session } } = await supabase.auth.getSession();

  // --- THE CORE AUTHENTICATION LOGIC ---

  // 1. Protect API routes
  if (!session && request.nextUrl.pathname.startsWith('/api/account')) {
    console.log('Middleware: Denying access to protected API route');
    return new NextResponse(
      JSON.stringify({ message: 'Authentication required.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Protect frontend pages (e.g., a user dashboard)
  if (!session && request.nextUrl.pathname.startsWith('/homepage')) {
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Refresh session if expired - important!
  return response
}

// Configure the middleware to only run on specific paths for performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}