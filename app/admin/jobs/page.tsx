'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Job {
  id: string
  title: string
  job_type: string
  is_active: boolean
}

export default function AdminJobs() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  async function loadJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id)
      if (error) throw error
      loadJobs()
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Error deleting job')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <Link href="/admin/jobs/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
            Create New Job
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Postings</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No job postings yet</p>
            <Link href="/admin/jobs/new" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
              Create First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">Type: {job.job_type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium px-3 py-1 rounded ${
                    job.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <Link href={`/admin/jobs/${job.id}`} className="px-4 py-1 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="px-4 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
