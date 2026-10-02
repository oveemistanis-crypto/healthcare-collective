# Healthcare Collective - Complete Deployment Guide

## Pre-Deployment Checklist

- [ ] All source files copied to Windows project
- [ ] `npm install` completed successfully
- [ ] `.env.local` created with all values
- [ ] `npm run dev` works locally
- [ ] Can login as admin
- [ ] Can register as candidate
- [ ] Can create job posting

---

## Step 1: Set Up Supabase (5 minutes)

### 1.1 Create Supabase Account
1. Go to https://supabase.com
2. Click "Sign up"
3. Use any email (can be different from Gmail)
4. Confirm email

### 1.2 Create New Project
1. Click "New project"
2. Organization: (default)
3. Name: `healthcare-collective`
4. Database password: **Create a strong password, save it**
5. Region: Choose closest to Australia (Sydney or Melbourne)
6. Click "Create new project" (wait 2-3 minutes)

### 1.3 Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy all SQL from `supabase-schema.sql`
4. Paste into SQL editor
5. Click "Run"
6. Check for green checkmarks (no errors)

### 1.4 Create Storage Bucket
1. Go to **Storage** in left sidebar
2. Click "Create new bucket"
3. Name: `applications`
4. **Uncheck "Private bucket"** (make it public)
5. Click "Create bucket"

### 1.5 Get API Keys
1. Go to **Settings > API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` (keep this private!)

---

## Step 2: Configure Email (10 minutes)

### 2.1 Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with the Gmail account you want to use for sending
3. Select: App = "Mail", Device = "Windows Computer"
4. Google will generate a 16-character password
5. Copy this password (you'll need it)

### 2.2 Update `.env.local`
Open `C:\Users\oveem\healthcare-collective\.env.local`:

```
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
NOTIFICATION_EMAIL=oveem_istanis@yahoo.com
```

**Important**: The password has spaces - that's correct, include them exactly.

### 2.3 Test Email
After deployment, send a test application to verify emails work.

---

## Step 3: Deploy to Vercel (15 minutes)

### 3.1 Push Code to GitHub
```bash
cd C:\Users\oveem\healthcare-collective
git init
git add .
git commit -m "Healthcare Collective recruitment platform"
git remote add origin https://github.com/YOUR_USERNAME/healthcare-collective
git branch -M main
git push -u origin main
```

**Note**: Create GitHub account if you don't have one: https://github.com/signup

### 3.2 Deploy to Vercel
1. Go to https://vercel.com
2. Sign up (use GitHub)
3. Click "Add New... > Project"
4. Select your `healthcare-collective` repo
5. Click "Import"
6. **Environment Variables**: Add all from `.env.local`
   - Copy each one from your `.env.local` file
   - Paste into Vercel dashboard
7. Click "Deploy"
8. Wait for build to complete (usually 3-5 minutes)
9. You'll see "Production" deployment URL

**Copy the URL** - this is your live platform!

---

## Step 4: Post-Deployment (5 minutes)

### 4.1 Test the Platform
1. Visit your Vercel URL (e.g., https://healthcare-collective.vercel.app)
2. **Test candidate flow**:
   - Go to "Sign Up"
   - Create an account with test email
   - Login
3. **Test admin flow**:
   - Go to `/admin/login`
   - Login with: `oveemistanis@gmail.com` / `Ovamami1988/`

### 4.2 Create Job Postings
1. In admin dashboard, click "Create New Job"
2. Fill in:
   - **Title**: e.g., "Receptionist"
   - **Description**: Role overview, responsibilities
   - **Requirements**: Skills, experience needed
   - **Job Type**: Full-time, Part-time, or Flexible
   - **Start Date**: Dec 2024 or Jan 2025
   - **Salary Range**: Optional
3. Click "Save Job"
4. Repeat for all 5 positions

### 4.3 Change Admin Password
1. Go to Vercel dashboard > Settings > Environment Variables
2. Edit `NEXT_PUBLIC_ADMIN_PASSWORD`
3. Change from `Ovamami1988/` to your new strong password
4. **Redeploy**: Go to Deployments > Redeploy latest

### 4.4 Test Email Notifications
1. As a candidate, submit an application
2. Check both:
   - Your email (candidate confirmation)
   - `oveem_istanis@yahoo.com` (admin notification)

---

## Step 5: Share with Candidates (Ongoing)

### Distribution Plan
1. **Get Vercel URL** from deployment
2. **Contact candidates personally** first (phone/text)
3. **Share link**: "Check this out, anonymous job board: [URL]"
4. They apply without knowing it's your clinic (initially)
5. After application received, you reach out personally

### Example Message
> "Hi [Name], I'm starting something new and thought you might be interested. There's an anonymous job board at [URL] with some interesting opportunities. No pressure, just wanted to pass it along."

---

## Troubleshooting

### "Build failed on Vercel"
1. Check the build logs (Vercel dashboard > Deployments)
2. Common issues:
   - Missing environment variable
   - Invalid API key
   - Database not initialized
3. Fix `.env.local`, commit, and redeploy

### "Applications not sending emails"
1. Check Gmail SMTP credentials
2. Verify app password is correct (16 chars, spaces included)
3. Make sure Gmail account has 2FA enabled
4. Test by submitting application

### "Can't login as admin"
1. Check `NEXT_PUBLIC_ADMIN_EMAIL` and `NEXT_PUBLIC_ADMIN_PASSWORD` match
2. Verify in Vercel environment variables
3. Redeploy after changing credentials

### "Jobs not showing on public board"
1. Check job is marked "is_active = TRUE" in database
2. Verify Supabase RLS policy on jobs table:
   - Should allow public SELECT where `is_active = true`

### "CV upload failing"
1. Check `applications` bucket exists in Supabase Storage
2. Verify bucket is **public** (not private)
3. Check storage permissions in RLS

---

## Maintenance

### Regular Checks
- Monitor applications weekly in admin dashboard
- Export CSV regularly for backup
- Update job postings as needed

### Backups
- Download applications CSV regularly
- Supabase auto-backs up (free plan = 7 days)
- GitHub repo serves as code backup

### Security
- Change admin password after initial setup
- Never commit `.env.local` to GitHub
- Keep Supabase API keys secret
- Monitor for unauthorized access

---

## Support Resources

- **Vercel docs**: https://vercel.com/docs
- **Supabase docs**: https://supabase.com/docs
- **Next.js docs**: https://nextjs.org/docs
- **Email troubleshooting**: Gmail app password guide

---

## Success Indicators

✅ Public job board loads without errors  
✅ Can register new candidate account  
✅ Can login as admin  
✅ Can create job posting  
✅ Candidate can see job and apply  
✅ Confirmation emails received  
✅ Admin sees application in dashboard  
✅ Can update application status

**Once all checks pass, you're ready to recruit!**
