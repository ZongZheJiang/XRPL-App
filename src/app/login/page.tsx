// app/login/page.tsx
import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login or Sign Up</h2>
        <AuthForm />
      </div>
    </div>
  )
}