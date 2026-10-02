'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Application {
  id: string
  status: string
  applied_at: string
  candidate: { email: string; first_name: string; last_name: string; phone: string }
  job: { title: string }
}

export default function AdminApplications() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadApplications()
  }, [filter])

  async function loadApplications() {
    try {
      let query = supabase
        .from('applications')
        .select(`*, candidate: candidates(*), job: jobs(*)`)
        .order('applied_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(appId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId)

      if (error) throw error
      loadApplications()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Applications</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded font-medium ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {app.candidate.first_name} {app.candidate.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Position: <strong>{app.job.title}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: <a href={`mailto:${app.candidate.email}`} className="text-blue-600">{app.candidate.email}</a>
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {app.candidate.phone}
                    </p>
                  </div>

                  <div className="ml-4 text-right space-y-2">
                    <span className={`inline-block text-sm font-medium px-3 py-1 rounded ${
                      app.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : app.status === 'accepted'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>

                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
