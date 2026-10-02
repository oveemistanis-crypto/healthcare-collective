# Healthcare Collective - Project Summary

**Status**: Code complete, ready for deployment  
**Platform**: Next.js 14 + Supabase + Vercel  
**Deployment Target**: Windows local dev → Vercel production

---

## What This Platform Does

Private, anonymous job board for recruiting healthcare professionals without alerting their current employer.

### Key Features
- **Candidate-facing**: Browse jobs, register, apply with CV
- **Admin-facing**: Create jobs, review applications, manage candidates
- **Anonymity**: No clinic branding (just "Healthcare Collective")
- **Low-touch**: No recruiter involvement, just private link sharing
- **Email notifications**: Auto-confirmation to candidates + admin alerts

### Business Logic
1. You contact 5 target people personally
2. You share anonymous job board URL
3. They apply not knowing it's your clinic
4. You receive application notification
5. You reach out to applicant personally after they apply

---

## Complete File Structure

### Source Files (What You Need)

```
healthcare-collective-source/
│
├── 📁 app/                          # Next.js app directory
│   ├── layout.tsx                   # Root layout wrapper
│   ├── page.tsx                     # Public job board homepage
│   ├── globals.css                  # Global styles + Tailwind imports
│   │
│   ├── 📁 jobs/
│   │   └── [id]/page.tsx            # Individual job detail + apply form
│   │
│   ├── 📁 register/
│   │   └── page.tsx                 # Candidate signup page
│   │
│   ├── 📁 login/
│   │   └── page.tsx                 # Candidate login page
│   │
│   ├── 📁 admin/
│   │   ├── 📁 login/
│   │   │   └── page.tsx             # Admin-only login
│   │   ├── 📁 dashboard/
│   │   │   └── page.tsx             # Admin overview (stats, quick actions)
│   │   ├── 📁 jobs/
│   │   │   ├── page.tsx             # List all job postings
│   │   │   └── [id]/page.tsx        # Create/edit job form
│   │   └── 📁 applications/
│   │       └── page.tsx             # Review + manage applications
│   │
│   └── 📁 api/
│       ├── 📁 email/confirmation/
│       │   └── route.ts             # Send confirmation + admin notification emails
│       └── 📁 admin/export/
│           └── route.ts             # Export applications as CSV
│
├── 📁 lib/                          # Utility functions
│   ├── supabase.ts                  # Initialize Supabase client
│   ├── auth.ts                      # Password hashing, JWT, cookies
│   └── email.ts                     # Email sending wrapper
│
├── 📁 public/                       # Static assets (empty for now)
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies + npm scripts
│   ├── tsconfig.json                # TypeScript settings
│   ├── next.config.js               # Next.js settings
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── postcss.config.mjs           # PostCSS config (for Tailwind)
│   └── .gitignore                   # Git ignore rules
│
├── 📄 Environment & Database
│   ├── .env.local.example           # Environment variables template
│   └── supabase-schema.sql          # Database schema (run in Supabase)
│
└── 📄 Documentation
    ├── README.md                    # Quick start guide
    ├── DEPLOYMENT_GUIDE.md          # Step-by-step deployment
    ├── PROJECT_SUMMARY.md           # This file
    └── setup.ps1                    # Windows setup script
```

---

## How Each File Works

### Pages (User Interfaces)

**`app/page.tsx`** - Public Job Board
- Lists all active jobs
- Shows job title, type, brief description
- Links to individual job details
- Has Login/Register buttons
- Logged-in candidates see "View Details"

**`app/jobs/[id]/page.tsx`** - Job Detail + Apply
- Full job description + requirements
- Upload CV field
- Optional cover letter
- Shows "Apply Now" button if logged in
- Logs job view to analytics
- After apply: sends confirmation email

**`app/register/page.tsx`** - Candidate Signup
- Email, password (min 8 chars), name, phone
- Password hashed with bcryptjs
- Stores in Supabase candidates table
- Sets auth cookie (7-day expiry)
- Redirects to home after signup

**`app/login/page.tsx`** - Candidate Login
- Email + password
- Verifies against hashed password in DB
- Sets auth cookie on success
- Shows error if credentials invalid

**`app/admin/login/page.tsx`** - Admin Gate
- Hardcoded email/password (from .env)
- Sets admin cookie on success
- Redirects to dashboard
- Only 1 admin user (you)

**`app/admin/dashboard/page.tsx`** - Admin Hub
- Shows stats: active jobs, total apps, pending apps
- Quick actions: Create Job, Review Applications
- System status overview
- Nav bar to other admin pages

**`app/admin/jobs/page.tsx`** - Manage Job Postings
- Lists all jobs (active + inactive)
- Edit/delete buttons
- Shows job type and active status
- "Create New Job" button

**`app/admin/jobs/[id]/page.tsx`** - Create/Edit Job
- Form for job title, description, requirements
- Job type dropdown (full-time, part-time, flexible)
- Optional: start date, salary range
- Saves to jobs table

**`app/admin/applications/page.tsx`** - Review Applications
- Lists all applications with candidate details
- Filter by status (pending, reviewed, accepted, rejected)
- Update status dropdown
- Shows email, phone
- Can download CV

### API Routes (Backend)

**`app/api/email/confirmation/route.ts`** - Send Emails
- Receives: email, name, jobTitle
- Sends confirmation to candidate (congratulates on apply)
- Sends alert to admin (new application received)
- Uses nodemailer + Gmail SMTP
- Called automatically after candidate applies

**`app/api/admin/export/route.ts`** - CSV Export
- Returns all applications as downloadable CSV
- Columns: name, email, job title, status, applied date
- Used by admin for spreadsheet tracking
- File named: `applications-YYYY-MM-DD.csv`

### Library Functions

**`lib/supabase.ts`** - Database Client
- Single instance of Supabase client
- Uses anon key (public) for client-side operations
- Used by all pages/API routes to query DB

**`lib/auth.ts`** - Authentication Helpers
- `hashPassword()` - bcryptjs hash for storage
- `verifyPassword()` - compare input to stored hash
- `setAuthCookie()` - store JWT in browser
- `getAuthCookie()` - retrieve JWT from browser
- `clearAuthCookie()` - logout user

**`lib/email.ts`** - Email Wrapper
- `sendApplicationConfirmation()` - calls email API
- Simple client-side wrapper
- Actually sends via backend API route

### Configuration

**`package.json`** - Dependencies
- Core: next, react, react-dom
- Database: @supabase/supabase-js
- Auth: bcryptjs, jose
- Email: nodemailer
- Dev: typescript, tailwindcss, @types/*

**`tsconfig.json`** - TypeScript
- Target ES2020 (modern JavaScript)
- Strict mode enabled
- Path alias: `@/*` resolves to project root

**`tailwind.config.ts`** - CSS Framework
- Content paths for auto-purging
- Uses Tailwind 4 with @tailwindcss/postcss plugin

**`.env.local.example`** - Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL          # From Supabase dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY     # From Supabase dashboard
SUPABASE_SERVICE_ROLE_KEY         # Secret key (keep private)
NEXT_PUBLIC_ADMIN_EMAIL           # Your email for login
NEXT_PUBLIC_ADMIN_PASSWORD        # Change after first login
NOTIFICATION_EMAIL                # Where to send app alerts
SMTP_USER                         # Gmail address
SMTP_PASSWORD                     # Gmail app password
```

### Database

**`supabase-schema.sql`** - Tables + RLS Policies
- **candidates**: id, email, password_hash, name, phone, cv_url
- **jobs**: id, title, description, requirements, type, start_date, is_active
- **applications**: id, candidate_id, job_id, cv_url, cover_letter, status
- **analytics**: id, job_id, event_type (viewed/applied)

RLS ensures:
- Anyone can view active jobs
- Only your admin account can manage jobs
- Candidates can only see their own apps (optional, not enforced)

---

## Data Flow

### Candidate Applies for Job

```
1. Candidate views job board (app/page.tsx)
   → Queries jobs table (is_active = true)
   → Logs view to analytics table

2. Candidate clicks job (app/jobs/[id]/page.tsx)
   → Loads full job details
   → Shows application form

3. Candidate uploads CV + optional cover letter
   → CV uploaded to Supabase Storage (applications bucket)
   → Application record created in applications table
   → Email API called (app/api/email/confirmation)

4. Email API sends:
   → Confirmation to candidate
   → Alert to you (admin) at notification email

5. You receive admin notification
   → Login to admin dashboard
   → See new application in "Applications" tab
   → Download CV, review details
   → Update status (reviewed, accepted, rejected)
   → Reach out to candidate personally
```

### Admin Creates Job

```
1. You login (app/admin/login)
   → Authenticated with admin cookie

2. Go to Jobs > Create New Job (app/admin/jobs/[id])
   → Fill form: title, description, requirements, type, start date

3. Click Save
   → New record inserted into jobs table
   → is_active = true (goes live immediately)

4. Candidate sees on public board
   → Can apply the same day
```

---

## Security Model

| Role | Can Do | Cannot Do |
|------|--------|----------|
| **Public** | View active jobs | See inactive jobs, access admin, see all applications |
| **Candidate** | Register, apply, see own data | Access other candidates, edit/delete |
| **Admin** | Create/edit jobs, view all applications, export CSV | Cannot be locked out (hardcoded credentials) |

**Password Security**:
- Candidate passwords hashed with bcryptjs (10 rounds)
- Admin password in environment (not hashed, hardcoded)
- JWT tokens (7-day expiry) stored in HTTP-only cookies

**Email**:
- Sent via Gmail SMTP (you must provide credentials)
- No emails stored, only sent
- Confirmation goes to candidate
- Alerts go to your notification email

---

## Deployment Architecture

```
Windows (Development)
├── npm run dev → localhost:3000
├── .env.local (all credentials)
└── node_modules/

GitHub (Code Storage)
├── All source files
├── .env.local NOT committed (in .gitignore)
└── Pull from main branch

Vercel (Production)
├── Pulls from GitHub
├── Environment variables from Vercel dashboard
├── Builds Next.js app
├── Deploys to CDN
└── https://healthcare-collective.vercel.app

Supabase (Database)
├── PostgreSQL database
├── Storage bucket for CVs
├── RLS policies for security
└── Accessed by Vercel via API keys
```

---

## Common Operations

### Create a New Job
1. Login to admin
2. Jobs > Create New Job
3. Fill form, click Save
4. Immediately visible on public board

### Review Applications
1. Admin dashboard > Applications tab
2. Filter by status (pending, reviewed, etc.)
3. Click candidate name to see details
4. Download CV
5. Update status when ready
6. Reach out personally

### Export Data
1. Admin dashboard
2. Look for "Export CSV" button (in applications)
3. Download file
4. Open in Excel

### Change Admin Password
1. Edit .env.local locally
2. Change NEXT_PUBLIC_ADMIN_PASSWORD
3. Commit & push to GitHub
4. Vercel auto-redeploys
5. New password active in 2-3 minutes

---

## Performance Notes

- **Database**: Queries are indexed on email, job_id, candidate_id
- **Storage**: CVs stored in Supabase (not in database)
- **Emails**: Sent asynchronously (don't block user)
- **Analytics**: Light logging for tracking views/applies
- **Free tier limits**: Supabase free = 500MB storage, Vercel free = unlimited

For 5 job postings + 50 applications total, you'll stay well under free tier limits.

---

## Next Steps

1. **Copy all files** to Windows project folder
2. **Run setup.ps1** or `npm install`
3. **Create .env.local** with Supabase + email credentials
4. **Run `npm run dev`** → test locally
5. **Follow DEPLOYMENT_GUIDE.md** → deploy to Vercel
6. **Share URL** with target candidates
7. **Monitor applications** in admin dashboard

---

**You're ready to deploy!** Follow DEPLOYMENT_GUIDE.md for step-by-step instructions.
