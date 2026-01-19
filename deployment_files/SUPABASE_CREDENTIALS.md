# Supabase Project Credentials

## Project Overview

**Organization:** deeplearn_courses (Free Plan)
**Project Name:** dohuub
**Region:** AWS us-east-1
**Plan:** NANO (Free tier)
**Status:** Active

---

## 1. Supabase Account & Credentials

### ✅ What you have:
- ✅ Supabase account created
- ✅ Project "dohuub" created
- ✅ PostgreSQL database provisioned
- ✅ All API keys generated
- ✅ Storage buckets created (listings, uploads)

---

## 2. API Credentials

### SUPABASE_URL
```
https://qiotpmjbhjpegylqgrwd.supabase.co
```

### SUPABASE_ANON_KEY (Publishable Key)
```
sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
```
**Usage:** Safe to use in browser/frontend with Row Level Security (RLS)

### SUPABASE_SERVICE_ROLE_KEY (Secret Key)
```
sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5
```
**⚠️ WARNING:** Keep this secret! Use only on backend servers, functions, workers

---

## 3. Database Connection

### Project ID
```
qiotpmjbhjpegylqgrwd
```

### PostgreSQL Connection String
```
postgresql://postgres:dohuub123!@qiotpmjbhjpegylqgrwd.supabase.co:5432/postgres
```

**Password:** `dohuub123!@` ✅ **CONFIGURED**

**Note:** Password is now included in this document for deployment use.

### Direct Connection Details
- **Host:** qiotpmjbhjpegylqgrwd.supabase.co
- **Port:** 5432
- **Database:** postgres
- **Username:** postgres
- **Password:** `dohuub123!@` ✅ **CONFIGURED**

---

## 4. Environment Variables Template

Create a `.env.local` or `.env` file with these variables:

```bash
# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA

# Backend/Server-side Only
SUPABASE_SERVICE_ROLE_KEY=sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5

# Database Connection (for Railway backend deployment)
DATABASE_URL=postgresql://postgres:dohuub123!@qiotpmjbhjpegylqgrwd.supabase.co:5432/postgres
```

---

## 5. Storage Buckets

### ✅ Current Status
- ✅ Storage buckets created successfully!

### Created Buckets

1. **`listings`** (Public) ✅
   - For storing listing images/files
   - Access: Public
   - File Size Limit: Unset (50 MB default)
   - MIME Types: Any
   - Status: Ready to use

2. **`uploads`** (Public) ✅
   - For user-uploaded files
   - Access: Public
   - File Size Limit: Unset (50 MB default)
   - MIME Types: Any
   - Status: Ready to use

### Access Buckets
- Navigate to: https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/storage/files
- Both buckets are ready for file uploads

---

## 6. Project Access URLs

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard |
| Project Dashboard | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd |
| Project Settings | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/settings/general |
| API Keys | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/settings/api-keys |
| Database | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/database/tables |
| Storage | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/storage/files |

---

## 7. Security Checklist

- ✅ SUPABASE_ANON_KEY is public-safe (frontend usage)
- ⚠️ SUPABASE_SERVICE_ROLE_KEY must be kept secret (backend only)
- ⚠️ DATABASE_URL contains sensitive connection info (backend only)
- ⚠️ Never commit `.env.local` to version control
- ⚠️ Add `.env.local` to `.gitignore`
- ✅ Row Level Security (RLS) is recommended for production

---

## 8. Quick Start Integration

### For React/Next.js

```bash
npm install @supabase/supabase-js
```

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default supabase
```

### For Node.js Backend

```bash
npm install @supabase/supabase-js
```

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default supabase
```

---

## 9. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Not authenticated" error | Use SUPABASE_ANON_KEY in frontend, ensure SUPABASE_URL is correct |
| Database connection failed | Verify password in Settings → Database, check IP whitelist |
| Storage bucket not accessible | Ensure bucket is set to "Public", check RLS policies |
| API key errors | Verify keys are in correct environment variables |

---

## 10. Next Steps

1. ✅ Set up environment variables in your project
2. ✅ Create storage buckets (listings, uploads) - DONE!
3. ⏳ Set up database schema/tables
4. ⏳ Configure Row Level Security (RLS) policies
5. ⏳ Integrate Supabase client into your application
6. ⏳ Set up authentication (if needed)

---

---

## ✅ Completion Status

| Item | Status | Date |
|------|--------|------|
| Supabase Account | ✅ Complete | 2026-01-18 |
| Project Created | ✅ Complete | 2026-01-18 |
| Database Provisioned | ✅ Complete | 2026-01-18 |
| API Keys Generated | ✅ Complete | 2026-01-18 |
| Storage Buckets (listings) | ✅ Complete | 2026-01-18 |
| Storage Buckets (uploads) | ✅ Complete | 2026-01-18 |

**Last Updated:** 2026-01-18
**Project:** dohuub (deeplearn_courses organization)
**Status:** All foundational setup complete! Ready for development.
