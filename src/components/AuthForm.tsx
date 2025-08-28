'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // Ensure this path is correct
import { useRouter } from 'next/navigation' // Correct hook

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() // Use useRouter for navigation

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      // On success, redirect to the dashboard
      router.push('/dashboard')
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      // On success, redirect to the dashboard
      router.push('/dashboard')
    }
  }

  // The rest of your form JSX remains the same...
  return (
    <form className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="p-2 border rounded text-black"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="p-2 border rounded text-black"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-4">
        <button
          onClick={handleSignIn}
          className="flex-1 p-2 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Sign In
        </button>
        <button
          onClick={handleSignUp}
          className="flex-1 p-2 bg-green-600 rounded text-white hover:bg-green-700"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}