'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Job {
  id: string
  title: string
  description: string
  job_type: string
}

export default function Home() {
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
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Healthcare Collective</h1>
            <p className="text-sm text-gray-600">Careers</p>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Growing Team
          </h2>
          <p className="text-xl text-gray-600">
            Explore rewarding careers in healthcare
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No open positions at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {job.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">
                    {job.job_type}
                  </span>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="w-full block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
