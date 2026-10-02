'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface JobForm {
  title: string
  description: string
  requirements: string
  job_type: string
  start_date: string
  salary_range: string
}

export default function JobForm() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const isNew = jobId === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<JobForm>({
    title: '',
    description: '',
    requirements: '',
    job_type: 'full-time',
    start_date: '',
    salary_range: '',
  })

  useEffect(() => {
    if (!isNew) loadJob()
  }, [])

  async function loadJob() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (error) throw error
      if (data) {
        setForm({
          title: data.title,
          description: data.description,
          requirements: data.requirements,
          job_type: data.job_type,
          start_date: data.start_date || '',
          salary_range: data.salary_range || '',
        })
      }
    } catch (error) {
      console.error('Error loading job:', error)
      setError('Failed to load job')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      if (isNew) {
        const { error } = await supabase.from('jobs').insert({
          ...form,
          is_active: true,
        })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('jobs')
          .update(form)
          .eq('id', jobId)
        if (error) throw error
      }

      router.push('/admin/jobs')
    } catch (error: any) {
      setError(error.message || 'Error saving job')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/admin/jobs" className="text-blue-600 hover:underline">
            ← Back to Jobs
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isNew ? 'Create New Job' : 'Edit Job'}
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Requirements *</label>
                <textarea
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Job Type</label>
                  <select
                    value={form.job_type}
                    onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-900 mb-2">Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g., $50,000 - $70,000 AUD"
                  value={form.salary_range}
                  onChange={(e) => setForm({ ...form, salary_range: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
                >
                  {saving ? 'Saving...' : 'Save Job'}
                </button>
                <Link href="/admin/jobs" className="flex-1 text-center bg-white text-gray-700 border border-gray-300 py-2 rounded hover:bg-gray-50 font-medium">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
