'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getAuthCookie } from '@/lib/auth'
import { sendApplicationConfirmation } from '@/lib/email'

interface Job {
  id: string
  title: string
  description: string
  requirements: string
  job_type: string
  start_date: string
}

export default function JobDetail() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadJob()
    checkAuth()
  }, [])

  async function loadJob() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (error) throw error
      setJob(data)

      // Log view
      await supabase.from('analytics').insert({
        job_id: jobId,
        event_type: 'viewed',
      })
    } catch (error) {
      console.error('Error loading job:', error)
      setError('Job not found')
    } finally {
      setLoading(false)
    }
  }

  function checkAuth() {
    const token = getAuthCookie()
    if (token) {
      try {
        const parsed = JSON.parse(token)
        if (parsed.candidateId) {
          setCandidateId(parsed.candidateId)
        }
      } catch {}
    }
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!candidateId || !cvFile) {
      setError('Please upload a CV')
      return
    }

    setError('')
    setApplying(true)

    try {
      // Get candidate info for confirmation email
      const { data: candidateData } = await supabase
        .from('candidates')
        .select('first_name, email')
        .eq('id', candidateId)
        .single()

      // Upload CV
      const fileName = `${candidateId}-${jobId}-${Date.now()}`
      const { error: uploadError } = await supabase.storage
        .from('applications')
        .upload(fileName, cvFile)

      if (uploadError) throw uploadError

      // Create application
      const { error: appError } = await supabase
        .from('applications')
        .insert({
          candidate_id: candidateId,
          job_id: jobId,
          cv_url: fileName,
          cover_letter: coverLetter || null,
          status: 'pending',
        })

      if (appError) throw appError

      // Log application
      await supabase.from('analytics').insert({
        job_id: jobId,
        event_type: 'applied',
      })

      // Send confirmation email
      if (candidateData && job) {
        await sendApplicationConfirmation(
          candidateData.email,
          candidateData.first_name,
          job.title
        )
      }

      setApplied(true)
    } catch (error: any) {
      setError(error.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-600">Loading job...</div>
  if (!job || error) return <div className="text-center py-12 text-red-600">{error || 'Job not found'}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            ← Back to Jobs
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex gap-4 mb-6 text-sm">
                <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded">{job.job_type}</span>
                {job.start_date && (
                  <span className="text-gray-600">Start: {new Date(job.start_date).toLocaleDateString()}</span>
                )}
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">About This Role</h2>
                <p className="whitespace-pre-line text-gray-700">{job.description}</p>

                <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">What We're Looking For</h2>
                <p className="whitespace-pre-line text-gray-700">{job.requirements}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Apply Now</h3>

              {applied ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  <p className="font-medium">Application Submitted!</p>
                  <p className="text-sm mt-1">Check your email for confirmation.</p>
                </div>
              ) : !candidateId ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Please log in or create an account to apply.
                  </p>
                  <Link href="/login" className="w-full block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">
                    Sign In
                  </Link>
                  <Link href="/register" className="w-full block text-center bg-white text-gray-700 border border-gray-300 py-2 rounded hover:bg-gray-50 font-medium">
                    Create Account
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Upload CV *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className="w-full text-sm"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      placeholder="Tell us why you're interested..."
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
