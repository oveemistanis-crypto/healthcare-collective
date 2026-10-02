export async function sendApplicationConfirmation(
  candidateEmail: string,
  candidateName: string,
  jobTitle: string
) {
  try {
    await fetch('/api/email/confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: candidateEmail,
        name: candidateName,
        jobTitle: jobTitle,
      }),
    })
  } catch (error) {
    console.error('Error sending confirmation email:', error)
  }
}
