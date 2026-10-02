# Healthcare Collective - Recruitment Platform

Private, anonymous job board for discretely recruiting healthcare professionals.

## Quick Start

### 1. Copy Files to Windows Project
Download all files from this folder and copy into:
```
C:\Users\oveem\healthcare-collective\
```

Ensure structure matches:
```
healthcare-collective/
├── app/
├── lib/
├── public/
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.js
└── ...
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env.local`
Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Then edit with:
- Supabase URL + API keys
- Gmail credentials
- Admin password (change from default)

### 4. Set Up Supabase

1. Create free account: https://supabase.com
2. Create new project
3. Run SQL schema from `supabase-schema.sql` in SQL editor
4. Create storage bucket: **Storage > Create bucket > Name: `applications` > Make public**
5. Copy Project URL and API keys into `.env.local`

### 5. Configure Email (Gmail)

1. Enable 2FA on Gmail account
2. Generate app password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ```

### 6. Run Locally
```bash
npm run dev
```

Visit:
- **Public job board**: http://localhost:3000
- **Admin dashboard**: http://localhost:3000/admin/login
- **Default admin credentials**: oveemistanis@gmail.com / Ovamami1988/

## File Structure

```
app/
├── page.tsx              # Public job board home
├── jobs/[id]/page.tsx    # Job detail + apply form
├── register/page.tsx     # Candidate signup
├── login/page.tsx        # Candidate login
├── admin/
│   ├── login/page.tsx    # Admin login
│   ├── dashboard/page.tsx # Admin overview
│   ├── jobs/
│   │   ├── page.tsx      # Job list
│   │   └── [id]/page.tsx # Create/edit job
│   └── applications/page.tsx # Review apps
├── api/
│   ├── email/confirmation/route.ts # Send confirmation emails
│   └── admin/export/route.ts       # CSV export
└── layout.tsx

lib/
├── supabase.ts           # Supabase client
├── auth.ts               # Authentication helpers
└── email.ts              # Email utilities
```

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/healthcare-collective
git push -u origin main
```

### 2. Deploy to Vercel
1. Visit https://vercel.com/new
2. Import your GitHub repo
3. Add environment variables in Vercel dashboard
4. Deploy

### 3. Add Custom Domain (Optional)
In Vercel dashboard > Settings > Domains > Add domain

## Admin Features

✅ Create/edit job postings  
✅ View applications with candidate details  
✅ Update application status (pending, reviewed, accepted, rejected)  
✅ Download CVs  
✅ CSV export of all applications  
✅ Analytics (views, applications per job)

## Candidate Experience

✅ Browse active job postings  
✅ Register with email/password  
✅ Upload CV (PDF/DOC/DOCX)  
✅ Optional cover letter  
✅ Automatic confirmation email  
✅ View application status

## Security

- Passwords hashed with bcryptjs
- Row Level Security (RLS) enabled on database
- Admin login separate from candidate login
- CV storage in Supabase (private bucket)
- Email notifications to admin only

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Email not sending
- Check SMTP credentials in `.env.local`
- Verify Gmail app password (16 chars, not regular password)
- Check admin email in environment variables

### Build errors
```bash
npm run build
```
Check output for specific errors. Delete `node_modules` and `.next` if stuck:
```bash
rm -r node_modules .next
npm install
npm run build
```

## Support

For issues, check:
1. Environment variables are set correctly
2. Supabase project is active
3. Storage bucket exists and is public
4. Gmail SMTP credentials are valid

## License

Proprietary - Healthcare Collective
