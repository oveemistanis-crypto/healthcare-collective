# Healthcare Collective - Complete File Manifest

**Total Files Created**: 27  
**All files ready to copy to Windows project**

---

## How to Use These Files

### Option 1: Automated Copy (Recommended)
1. Download the entire `healthcare-collective-source` folder
2. Copy all contents into: `C:\Users\oveem\healthcare-collective\`
3. Folder structure should match exactly
4. Run: `npm install`
5. Done!

### Option 2: Manual File Organization
Create the folder structure and copy files one by one:

```
C:\Users\oveem\healthcare-collective\
├── app/
├── lib/
├── public/ (empty)
├── package.json
├── ... (config files)
└── (documentation files)
```

---

## Complete File Listing

### 📂 App Directory (`app/`)

| File | Purpose | Lines |
|------|---------|-------|
| `layout.tsx` | Root HTML wrapper, metadata | 18 |
| `page.tsx` | Public job board homepage | 105 |
| `globals.css` | Global Tailwind styles | 50 |

### 📂 Jobs Pages (`app/jobs/`)

| File | Purpose | Lines |
|------|---------|-------|
| `[id]/page.tsx` | Job detail + application form | 160 |

### 📂 Authentication Pages (`app/register/`, `app/login/`)

| File | Purpose | Lines |
|------|---------|-------|
| `register/page.tsx` | Candidate signup | 130 |
| `login/page.tsx` | Candidate login | 95 |

### 📂 Admin Pages (`app/admin/`)

| File | Purpose | Lines |
|------|---------|-------|
| `admin/login/page.tsx` | Admin-only login gate | 65 |
| `admin/dashboard/page.tsx` | Admin overview + stats | 110 |
| `admin/jobs/page.tsx` | List/manage job postings | 110 |
| `admin/jobs/[id]/page.tsx` | Create/edit job form | 160 |
| `admin/applications/page.tsx` | Review applications | 140 |

### 📂 API Routes (`app/api/`)

| File | Purpose | Lines |
|------|---------|-------|
| `api/email/confirmation/route.ts` | Send confirmation + admin alert emails | 60 |
| `api/admin/export/route.ts` | Export applications as CSV | 70 |

### 📂 Library Utilities (`lib/`)

| File | Purpose | Lines |
|------|---------|-------|
| `lib/supabase.ts` | Supabase client initialization | 12 |
| `lib/auth.ts` | Auth helpers (hash, verify, cookies) | 45 |
| `lib/email.ts` | Email API wrapper | 15 |

### ⚙️ Configuration Files

| File | Purpose | Required |
|------|---------|----------|
| `package.json` | Dependencies + scripts | ✅ Yes |
| `tsconfig.json` | TypeScript config | ✅ Yes |
| `next.config.js` | Next.js settings | ✅ Yes |
| `tailwind.config.ts` | Tailwind CSS config | ✅ Yes |
| `postcss.config.mjs` | PostCSS config | ✅ Yes |
| `.gitignore` | Git ignore rules | ✅ Yes |

### 🔐 Environment & Database

| File | Purpose | Action |
|------|---------|--------|
| `.env.local.example` | Environment template | Copy → .env.local, edit values |
| `supabase-schema.sql` | Database schema | Run in Supabase SQL editor |

### 📚 Documentation

| File | Purpose | Read First |
|------|---------|------------|
| `README.md` | Quick start guide | ✅ First |
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment | ✅ Before deploy |
| `PROJECT_SUMMARY.md` | Architecture overview | ✅ For understanding |
| `setup.ps1` | Windows setup automation | Optional, for Windows |
| `FILES_MANIFEST.md` | This file | Reference |

---

## Pre-Copy Checklist

Before copying files to Windows, verify you have:

- [ ] Downloaded entire `healthcare-collective-source` folder
- [ ] Extracted to temporary location
- [ ] `C:\Users\oveem\healthcare-collective\` folder created
- [ ] Node.js 24.x installed on Windows
- [ ] npm 11.x installed on Windows

---

## Copy Instructions

### Windows File Explorer Method

1. **Download/Extract source folder** to temporary location
2. **Open** `C:\Users\oveem\healthcare-collective\`
3. **Copy all files** from source into this folder
4. **Verify structure**:
   ```
   healthcare-collective/
   ├── app/ (contains pages)
   ├── lib/ (contains utilities)
   ├── package.json
   ├── tsconfig.json
   └── (other files)
   ```
5. **Open PowerShell** in this folder
6. **Run**: `npm install`

### PowerShell/Command Line Method

```powershell
cd C:\Users\oveem\healthcare-collective
# Copy all files from source...
npm install
```

---

## Post-Copy Verification

After copying, verify all files are present:

```powershell
cd C:\Users\oveem\healthcare-collective

# Check app files exist
Test-Path app\page.tsx
Test-Path app\layout.tsx
Test-Path app\jobs\[id]\page.tsx

# Check lib files exist
Test-Path lib\supabase.ts
Test-Path lib\auth.ts

# Check config files exist
Test-Path package.json
Test-Path tsconfig.json
Test-Path next.config.js

# Check docs exist
Test-Path README.md
Test-Path DEPLOYMENT_GUIDE.md
```

All should return `True`.

---

## Key Files to Modify

After copying, you **must** edit these files:

1. **`.env.local`** (create from `.env.local.example`)
   - Add Supabase URL and keys
   - Add Gmail credentials
   - Add notification email

2. **`package.json`** (optional tweaks)
   - Already configured correctly
   - Only edit if you need different versions

3. **Any hardcoded values** to check:
   - Admin email in `app/admin/login/page.tsx` (uses env var, OK)
   - Notification email in email API (uses env var, OK)

---

## File Dependencies

Some files depend on others being present:

| File | Depends On |
|------|-----------|
| All pages | `app/layout.tsx`, `app/globals.css` |
| `app/jobs/[id]/page.tsx` | `lib/supabase.ts`, `lib/email.ts` |
| `app/admin/*` | All need `lib/auth.ts` |
| API routes | `lib/supabase.ts` |
| Everything | `package.json` (dependencies) |

If you're missing a dependency, `npm install` will fail with a clear error.

---

## File Sizes

For reference, here's what you're downloading:

```
app/                        ~1.5 KB (source code)
lib/                        ~2 KB
api/                        ~3 KB
Configuration files         ~2 KB
Documentation files         ~30 KB
Total uncompressed          ~40 KB
```

Very lightweight. All will fit in Vercel's generous free tier.

---

## Next Steps After Copying

1. Copy all files to Windows project folder
2. Run `npm install`
3. Create `.env.local` from template
4. Run `npm run dev` to test locally
5. Follow `DEPLOYMENT_GUIDE.md` to deploy to Vercel

---

## Support

If you're missing files or get errors:

1. **Download again** - ensure all files extracted
2. **Check file names** - case-sensitive on GitHub/Mac (Windows OK)
3. **Verify structure** - match folder organization exactly
4. **Check imports** - all `@/` imports resolve to correct files
5. **Run `npm install`** - installs all dependencies

The build process will tell you if any files are missing.

---

**Ready to copy!** Download the `healthcare-collective-source` folder and follow the copy instructions above.
