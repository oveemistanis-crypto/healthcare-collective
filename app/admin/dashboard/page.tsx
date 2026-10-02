'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getAuthCookie, clearAuthCookie } from '@/lib/auth'

interface Stats {
  totalJobs: number
  totalApplications: number
  pendingApplications: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    loadStats()
  }, [])

  async function checkAuth() {
    const token = getAuthCookie()
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const parsed = JSON.parse(token)
      if (!parsed.isAdmin) {
        router.push('/admin/login')
      }
    } catch {
      router.push('/admin/login')
    }
  }

  async function loadStats() {
    try {
      const [jobsRes, appsRes, pendingRes] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('applications').select('id', { count: 'exact' }),
        supabase.from('applications').select('id', { count: 'exact' }).eq('status', 'pending'),
      ])

      setStats({
        totalJobs: jobsRes.count || 0,
        totalApplications: appsRes.count || 0,
        pendingApplications: pendingRes.count || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    clearAuthCookie()
    document.cookie = 'admin=; path=/; max-age=0'
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <Link href="/admin/dashboard" className="pb-4 font-medium text-blue-600 border-b-2 border-blue-600">
            Overview
          </Link>
          <Link href="/admin/jobs" className="pb-4 font-medium text-gray-600 hover:text-gray-900">
            Job Postings
          </Link>
          <Link href="/admin/applications" className="pb-4 font-medium text-gray-600 hover:text-gray-900">
            Applications
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Pending Review</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.pendingApplications || 0}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin/jobs/new" className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">
                Create New Job
              </Link>
              <Link href="/admin/applications" className="block text-center bg-white text-gray-700 border border-gray-300 py-2 rounded hover:bg-gray-50 font-medium">
                Review Applications
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Platform: Healthcare Collective</p>
              <p>Admin: {process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'oveemistanis@gmail.com'}</p>
              <p>Status: <span className="text-green-600 font-medium">Active</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
