# Deployment Setup Credentials & Guide
1KJ1QV5YLG718VT394A8P6UB
**Date:** January 18, 2026
**Project:** DoHuub
**Purpose:** Complete deployment setup for backend and frontend
**Tech Stack:** Express.js + Prisma + PostgreSQL + React + Vite

---

## Overview

**Architecture:**
- **Backend:** Express.js API → Railway/Render
- **Database:** Supabase PostgreSQL
- **File Storage:** Supabase Storage (S3-compatible)
- **Email:** SendGrid API
- **Payment:** Stripe (mock data for now)
- **Frontend:** React + Vite → Vercel/Netlify

---

## Prerequisites & Required Items

### 1. Supabase Account & Credentials ✅

**Status:** ✅ COMPLETE

**Items Provided:**
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@qiotpmjbhjpegylqgrwd.supabase.co:5432/postgres
SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
SUPABASE_SERVICE_ROLE_KEY=sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5
```

**Completed Actions:**
- ✅ Sign up at supabase.com
- ✅ Create new project "dohuub"
- ✅ Go to Settings → API → Keys copied
- ✅ Go to Settings → Database → Connection string ready
- ✅ Go to Storage → Created bucket: `listings` (public)
- ✅ Go to Storage → Created bucket: `uploads` (public)

**Supabase Supports:**
- ✅ PostgreSQL with Prisma (full support)
- ✅ File uploads (S3-compatible API)
- ✅ Image storage with CDN
- ✅ All backend needs covered

**Dashboard Access:**
- Project: https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd
- Storage: https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/storage/files
- API Keys: https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/settings/api-keys
- Database: https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/database/tables

---

### 2. SendGrid Account & API Key ⏳

**Status:** ⏳ REQUIRED - YOU NEED TO SET UP

**Steps to Complete:**

1. **Create SendGrid Account**
   - Go to: https://sendgrid.com/
   - Sign up (free tier: 100 emails/day)
   - Verify email

2. **Create API Key**
   - Go to: Settings → API Keys
   - Click "Create API Key"
   - Name: "DoHuub OTP"
   - Permissions: Full Access (or Mail Send only for production)
   - Copy API key (shown once - save it!)
   - Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

3. **Verify Sender Email**
   - Go to: Settings → Sender Authentication
   - Option A: Single Sender Verification (quick, use any email)
     - Click "Verify a Single Sender"
     - Enter email: `noreply@yourdomain.com` (or your email)
     - Confirm verification link in email
     - Takes ~5 minutes
   - Option B: Domain Authentication (production only, requires DNS changes)

**Items to Provide:**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@yourdomain.com
```

**What SendGrid Provides:**
- ✅ OTP email sending
- ✅ Transactional emails
- ✅ Email templates (optional)
- ✅ 100 emails/day free tier
- ✅ Production-ready email infrastructure

---

### 3. Deployment Platform - Backend ⏳

**Recommended: Railway** (easiest for Express.js)

**Status:** ⏳ REQUIRED - YOU NEED TO SET UP

**Steps to Complete:**

1. **Sign Up for Railway**
   - Go to: https://railway.app/
   - Click "Start Project"
   - Login with GitHub
   - Authorize Railway

2. **Connect GitHub Repository**
   - Click "Deploy from GitHub repo"
   - Select your repo
   - Authorize if prompted

3. **Configure Backend**
   - Root Directory: `apps/api` (or your backend folder)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - Go to Variables tab
   - Add all environment variables (see section below)
   - Save

5. **Deploy**
   - Click Deploy
   - Wait for build to complete
   - Copy URL: `https://your-app.up.railway.app`

**Alternative: Render**
- https://render.com/
- Similar setup process
- Auto-deploy from GitHub

**Items to Provide After Setup:**
```
RAILWAY_URL=https://dohuub1-production.up.railway.app
RAILWAY_PORT=3001
RAILWAY_STATUS=✅ DEPLOYED & ONLINE
```

---

### 4. Frontend Hosting ⏳

**Recommended: Vercel** (best for React + Vite)

**Status:** ⏳ REQUIRED - YOU NEED TO SET UP

**Steps to Complete:**

1. **Sign Up for Vercel**
   - Go to: https://vercel.com/
   - Click "Continue with GitHub"
   - Authorize Vercel

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repo
   - Click "Import"

3. **Configure Frontend**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `apps/web` (or your frontend folder)

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = Backend URL from Railway
   - Save

5. **Deploy**
   - Click Deploy
   - Wait for build to complete
   - Copy URL: `https://your-app.vercel.app`

**Items to Provide After Setup:**
```
VERCEL_URL=https://your-app.vercel.app
```

---

## Environment Variables

### Backend `.env` (Railway)

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@qiotpmjbhjpegylqgrwd.supabase.co:5432/postgres

# Supabase Storage
SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
SUPABASE_SERVICE_ROLE_KEY=sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5

# Email (SendGrid) - ✅ GENERATED
SENDGRID_API_KEY=<REDACTED - stored in Railway environment variables>
SENDER_EMAIL=noreply@dohuub.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# API
API_PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app

# Stripe (Mock/Test - Optional)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Important Notes:**
- `DATABASE_URL`: Replace `[PASSWORD]` with actual Supabase database password
- `JWT_SECRET`: Generate a secure random string (min 32 characters)
- `SENDGRID_API_KEY`: Get from SendGrid dashboard (starts with `SG.`)
- `SENDER_EMAIL`: Use the verified email from SendGrid

### Frontend `.env` (Vercel)

```env
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```

**Note:** Replace with actual Railway URL once deployed

---

## Step-by-Step Deployment Checklist

### ✅ Phase 1: Supabase (COMPLETE)
- [x] Supabase account created
- [x] Project "dohuub" created
- [x] Database credentials copied
- [x] API keys generated
- [x] Storage buckets created (listings, uploads)

### ⏳ Phase 2: SendGrid (REQUIRED)
- [ ] SendGrid account created
- [ ] API key generated
- [ ] Sender email verified
- [ ] API key saved securely

### ✅ Phase 3: Backend Deployment (COMPLETE)
- [x] Railway account created
- [x] GitHub repo connected
- [x] Backend folder configured
- [x] Environment variables added (Database, Supabase, SendGrid, JWT)
- [x] Backend deployed
- [x] Railway URL obtained

### ⏳ Phase 4: Frontend Deployment (REQUIRED)
- [ ] Vercel account created
- [ ] GitHub repo connected
- [ ] Frontend folder configured
- [ ] Environment variables added (API URL)
- [ ] Frontend deployed
- [ ] Vercel URL obtained

---

## Code Updates Required

### 1. Replace Nodemailer → SendGrid

**File:** `apps/api/src/utils/otp.ts`

```bash
# Install SendGrid package
npm install @sendgrid/mail
```

```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOtpEmail(email, otp) {
  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Your DoHuub Login Code',
      html: `
        <h2>Your Login Code</h2>
        <p>Enter this code to log in:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });
  } catch (error) {
    console.error('SendGrid error:', error);
    throw error;
  }
}
```

### 2. Add Supabase Storage

**File:** `apps/api/src/routes/upload.ts`

```bash
# Install packages
npm install @supabase/supabase-js multer
```

```javascript
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const bucket = req.body.bucket; // 'listings' or 'uploads'

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${Date.now()}-${file.originalname}`, file.buffer);

    if (error) throw error;

    res.json({ url: data.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Update Environment Variables

**File:** `apps/api/.env.production`

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@qiotpmjbhjpegylqgrwd.supabase.co:5432/postgres
SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
SUPABASE_SERVICE_ROLE_KEY=sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@yourdomain.com
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
API_PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Cost Estimates

### Free Tier (Development)
- **Supabase:** Free (500MB DB, 1GB storage)
- **SendGrid:** Free (100 emails/day)
- **Railway:** Free ($5 credit/month)
- **Vercel:** Free (100GB bandwidth)
- **Total:** $0/month

### Production (Small Scale)
- **Supabase:** $25/month (Professional plan)
- **SendGrid:** $29/month (or free if <100 emails/day)
- **Railway:** $5-20/month
- **Vercel:** $20/month (Pro plan, optional)
- **Total:** ~$50-75/month

---

## Troubleshooting

### Backend Issues

| Issue | Solution |
|-------|----------|
| Build fails on Railway | Check build command, ensure all dependencies listed in package.json |
| Database connection error | Verify DATABASE_URL is correct, check Supabase dashboard |
| SendGrid emails not sending | Verify API key is correct, check sender email is verified |
| CORS errors | Add frontend URL to CORS middleware in backend |

### Frontend Issues

| Issue | Solution |
|-------|----------|
| Build fails on Vercel | Check build command, ensure root directory is correct |
| API not responding | Verify VITE_API_URL environment variable is set correctly |
| Files not uploading | Check Supabase storage bucket is public, verify API key |

---

## Security Checklist

- ⚠️ Never commit `.env` files to Git
- ⚠️ Add `.env.local` and `.env.production` to `.gitignore`
- ✅ Use Railway/Vercel environment variable UI (don't paste in code)
- ✅ Rotate SendGrid API key if compromised
- ✅ Use strong JWT_SECRET (min 32 characters)
- ✅ Enable 2FA on SendGrid and Railway accounts
- ✅ Limit API key permissions (SendGrid: Mail Send only)

---

## Quick Reference URLs

| Service | URL |
|---------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd |
| SendGrid Dashboard | https://app.sendgrid.com/ |
| Railway Dashboard | https://railway.app/ |
| Vercel Dashboard | https://vercel.com/ |
| Supabase Storage | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/storage/files |
| Supabase API Keys | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/settings/api-keys |

---

## Completion Status

| Item | Status | Notes |
|------|--------|-------|
| Supabase Setup | ✅ Complete | Database, Storage buckets ready |
| SendGrid Account | ✅ Complete | API Key generated: SG.OA2fSUeyQFGT_Q2lgb82Ag... |
| Railway Backend | ✅ Complete | Deployed to https://dohuub1-production.up.railway.app |
| Public Domain | ✅ Complete | Generated with port 3001 (Metal Edge) |
| Vercel Frontend | ⏳ Pending | Next step for deployment |
| Code Updates | ⏳ Required | Replace Nodemailer, add Supabase |
| Environment Variables | ✅ Complete | Supabase ✅, SendGrid ✅, Railway ✅, Pending Vercel URL |

---

**Last Updated:** 2026-01-18
**Status:** Railway Backend Deployment Complete! ✅ (75% Overall Progress)
**Progress Summary:**
- ✅ Supabase: Database & Storage Ready
- ✅ SendGrid: Email Service Configured
- ✅ Railway: Backend Deployed at https://dohuub1-production.up.railway.app
- ⏳ Vercel: Frontend Deployment (Next Step)

**Next Steps:**
1. Deploy frontend to Vercel (React + Vite)
2. Configure frontend environment variables with Railway API URL
3. Test end-to-end integration
4. Migrate to cloud database from localhost (production-ready)
