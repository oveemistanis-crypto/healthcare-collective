import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Healthcare Collective - Careers',
  description: 'Join our growing healthcare team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}
