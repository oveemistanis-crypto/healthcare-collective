'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAuthCookie } from '@/lib/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'oveemistanis@gmail.com'
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Ovamami1988/'
      
      if (email !== adminEmail || password !== adminPassword) {
        setError('Invalid admin credentials')
        setLoading(false)
        return
      }

      const token = JSON.stringify({ isAdmin: true, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
      setAuthCookie(token)
      document.cookie = `admin=${token}; path=/; max-age=${7 * 24 * 60 * 60}`

      router.push('/admin/dashboard')
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600 mb-6">Recruitment Management System</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:border-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
            >
              {loading ? 'Logging In...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Healthcare Collective Recruitment Platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}
