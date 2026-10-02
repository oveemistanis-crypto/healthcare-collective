import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Fetch all applications with related data
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        applied_at,
        candidate: candidates(email, first_name, last_name, phone),
        job: jobs(title)
      `)
      .order('applied_at', { ascending: false })

    if (error) throw error

    // Convert to CSV
    const headers = [
      'Application ID',
      'Candidate Name',
      'Email',
      'Phone',
      'Job Title',
      'Status',
      'Applied Date',
    ]

    const rows = data.map((app: any) => [
      app.id,
      `${app.candidate.first_name} ${app.candidate.last_name}`,
      app.candidate.email,
      app.candidate.phone || '',
      app.job.title,
      app.status,
      new Date(app.applied_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="applications-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
