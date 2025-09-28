// app/components/AuthManager.tsx
import { client } from '../lib/supabaseClient'
import AuthForm from '@/components/AuthForm'
import Dashboard from '@/components/Dashboard'
import { NextResponse } from 'next/server'

export default async function AuthManager() {
  // Fetch the user session
  const { data: { user } } = await client.auth.getUser()

  // Conditionally render the correct component
  if (user) {
    // If user is logged in, show the welcome view
    return <Dashboard user = {user}/>
  } else {
    // If user is not logged in, show the login/signup form
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login or Sign Up</h2>
        <AuthForm />
      </div>
    )
  }
}