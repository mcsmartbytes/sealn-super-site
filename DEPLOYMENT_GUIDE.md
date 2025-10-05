# Seal'n & Stripe'n Specialist - Deployment Guide

## 🚀 Free Deployment on Vercel + Supabase

This guide will walk you through deploying your site **100% FREE** using Vercel and Supabase free tiers.

---

## Step 1: Setup Supabase Database (FREE)

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Create a new project**
   - Name: `sealn-stripe-specialist`
   - Database Password: Choose a strong password
   - Region: Choose closest to your location
   - Wait 2-3 minutes for database to initialize

3. **Run the SQL Schema**
   - Go to **SQL Editor** in left sidebar
   - Click **New Query**
   - Copy and paste contents of `supabase-schema.sql` from your project root
   - Click **Run** to create all tables

4. **Setup Authentication**
   - Go to **Authentication** → **Providers**
   - Enable **Email** provider (already enabled by default)
   - Go to **Authentication** → **Users**
   - Click **Add User** → **Create new user**
   - Enter your admin email and password
   - ✅ Your admin account is created!

5. **Get your API keys**
   - Go to **Settings** → **API**
   - Copy these two values:
     - `Project URL` → This is `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 2: Deploy to Vercel (FREE)

### Option A: Deploy via GitHub (Recommended)

1. **Push code to GitHub**
   ```bash
   cd /home/mcsmart/project/sealn-super-site
   git init
   git add .
   git commit -m "Initial commit - Seal'n & Stripe'n Specialist site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sealn-super-site.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
   - Click **Add New** → **Project**
   - Import your `sealn-super-site` repository
   - Configure:
     - Framework Preset: **Next.js**
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables**
   Click **Environment Variables** and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-from-step-1
   ```

4. **Click Deploy** 🚀
   - Wait 2-3 minutes
   - Your site is live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
cd /home/mcsmart/project/sealn-super-site

# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted

# Deploy to production
vercel --prod
```

---

## Step 3: Custom Domain (Optional)

### Free Option: Use Vercel's free subdomain
- Your site is available at `https://your-project.vercel.app`

### Paid Option: Add your own domain
1. Go to Vercel Dashboard → **Settings** → **Domains**
2. Add your domain (e.g., `sealnstripenspecialist.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

---

## Step 4: Test Your Deployment

1. **Visit your live site**
   - Home page should load with navy/gold professional design
   - Test all navigation links

2. **Test Admin Login**
   - Go to `/admin` or `/admin/login`
   - Login with the admin email/password you created in Supabase
   - You should see the admin dashboard

3. **Test Admin Functions**
   - Try adding a customer
   - Try creating an estimate
   - Try creating an invoice
   - All data should save to Supabase

4. **Test Contact Form**
   - Fill out contact form on home page
   - Check Supabase → **Table Editor** → `contact_submissions`
   - Your submission should appear there

---

## 💰 Cost Breakdown (100% FREE for small business)

### Supabase Free Tier Includes:
- ✅ 500MB Database
- ✅ 1GB File Storage
- ✅ 2GB Bandwidth
- ✅ 50,000 Monthly Active Users
- ✅ Unlimited API requests
- **Perfect for small business with up to 10,000 customers**

### Vercel Free Tier Includes:
- ✅ 100GB Bandwidth/month
- ✅ Unlimited websites
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- **Perfect for business sites with ~10,000 monthly visitors**

### When You Need to Upgrade:
- Supabase Pro ($25/month): More than 500MB data or 2GB bandwidth
- Vercel Pro ($20/month): More than 100GB bandwidth or need custom domains

---

## 🔧 Maintenance & Updates

### Update Your Site
```bash
cd /home/mcsmart/project/sealn-super-site
# Make your changes
git add .
git commit -m "Update description of changes"
git push
```
**Vercel will automatically deploy changes in ~2 minutes!**

### View Deployment Logs
- Vercel Dashboard → Your Project → **Deployments**
- Click any deployment to see logs

### Database Backups
- Supabase automatically backs up your database daily (free tier)
- Manual backup: Go to **Database** → **Backups**

---

## 🆘 Troubleshooting

### Site not loading?
- Check Vercel deployment logs
- Verify environment variables are set correctly

### Admin login not working?
- Check Supabase → Authentication → Users
- Verify email/password
- Check browser console for errors

### Data not saving?
- Check Supabase → SQL Editor → run: `SELECT * FROM customers;`
- Check RLS policies are correct
- Check browser console for errors

### Need help?
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

## ✅ Post-Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables created via SQL
- [ ] Admin user created in Supabase Auth
- [ ] Environment variables added to Vercel
- [ ] Site deployed to Vercel
- [ ] Admin login tested
- [ ] Customer management tested
- [ ] Estimate creation tested
- [ ] Invoice creation tested
- [ ] Contact form tested
- [ ] Custom domain added (optional)

---

## 🎉 You're Done!

Your professional business site is now live and ready to use, completely FREE!

**Live Site:** `https://your-project.vercel.app`
**Admin Panel:** `https://your-project.vercel.app/admin`

Total Monthly Cost: **$0** 💰
