import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email, name, jobTitle } = await request.json()

    if (!email || !name || !jobTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Application Confirmation - ${jobTitle}`,
      html: `
        <h2>Application Received</h2>
        <p>Hi ${name},</p>
        <p>Thank you for your application for the <strong>${jobTitle}</strong> position.</p>
        <p>We've received your CV and will review it shortly. We'll be in touch if we'd like to move forward with your application.</p>
        <p>Best regards,<br/>Healthcare Collective</p>
      `,
    }

    // Send confirmation to candidate
    await transporter.sendMail(mailOptions)

    // Send notification to admin
    const adminEmail = process.env.NOTIFICATION_EMAIL
    if (adminEmail) {
      const adminOptions = {
        from: process.env.SMTP_USER,
        to: adminEmail,
        subject: `New Application - ${jobTitle}`,
        html: `
          <h2>New Application Received</h2>
          <p><strong>${name}</strong> has applied for <strong>${jobTitle}</strong></p>
          <p>Email: ${email}</p>
          <p>Log in to your admin dashboard to review their application.</p>
        `,
      }
      await transporter.sendMail(adminOptions)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
