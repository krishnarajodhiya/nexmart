# 🚀 Deploy NexMart to Vercel (Free)

## What Changed

The backend Express server has been **fully converted into Next.js API Routes**.
You no longer need a separate server. Everything runs inside the Next.js app on Vercel's free tier.

```
frontend/src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   └── me/route.ts
├── products/
│   ├── route.ts
│   └── [id]/route.ts
├── categories/route.ts
├── cart/route.ts
├── orders/
│   ├── route.ts  
│   └── [id]/route.ts
├── wishlist/route.ts
├── users/route.ts
└── reviews/route.ts
```

---

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# In the root of your project (untitled folder 2)
cd "/Users/krishna_rajodhiya/Desktop/untitled folder 2"
git init
git add .
git commit -m "Initial commit: NexMart e-commerce app"

# Create a repo on github.com (free), then:
git remote add origin https://github.com/YOUR_USERNAME/nexmart.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to **https://vercel.com** → Sign up free (use GitHub login)
2. Click **"Add New Project"**
3. Import your **GitHub repo**
4. Set **Root Directory** to `frontend` *(important!)*
5. Add these **Environment Variables**:

| Variable | Value |
|----------|-------|
| `JWT_SECRET` | `any-long-random-string-here` |
| `NEXTAUTH_SECRET` | `another-random-string` |
| `NEXTAUTH_URL` | `https://YOUR-APP.vercel.app` |

6. Click **Deploy** → Done! 🎉

---

## ⚠️ Demo Mode Limitations

Since this uses an **in-memory store** (no real database):

| Feature | Behavior |
|---------|----------|
| Products/categories | ✅ Always available (seeded on startup) |
| User registration | ✅ Works — but resets on redeploy |
| Cart / Orders | ✅ Works per session |
| Data persistence | ❌ Resets on cold start |
| Admin | ✅ `admin@nexmart.com` / `admin123` |

### To Make Data Permanent (Optional Upgrade)

Add **MongoDB Atlas** (free 512MB tier):
1. Create free cluster at https://mongodb.com/atlas
2. Add env var: `MONGODB_URI=mongodb+srv://...`
3. Update API routes to use Mongoose instead of in-memory store

---

## Test Locally Before Deploying

```bash
cd "/Users/krishna_rajodhiya/Desktop/untitled folder 2/frontend"
npm run build   # Must succeed with no errors
npm run start   # Test the production build locally
```

Then visit http://localhost:3000

---

## Admin Credentials

- **Email:** `admin@nexmart.com`
- **Password:** `admin123`
