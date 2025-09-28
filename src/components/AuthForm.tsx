'use client'

import { useState } from 'react'
import { client } from '@/lib/supabaseClient' // Ensure this path is correct
import { useRouter } from 'next/navigation' // Correct hook
import { set } from 'zod'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const router = useRouter() // Use useRouter for navigation

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSigningUp(true)
    const { error } = await client.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      // On success, redirect to the dashboard
      router.refresh()
    }
    setIsSigningUp(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      // On success, redirect to the dashboard
      router.push('/homepage')
    }
  }

  // The rest of your form JSX remains the same...
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <legend className="fieldset-legend">Login</legend>

      <label className="label">Email</label>
      <input type="email" className="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)}
/>

      <label className="label">Password</label>
      <input type="password" className="input" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
      {error && <p className="text-red-500">{error}</p>}
      <button className="btn btn-neutral mt-4" onClick={handleSignIn}>Login</button>
      <button className="btn btn-neutral mt-4 ml-4" onClick={handleSignUp}>Sign Up</button>
    </fieldset>
  )
}