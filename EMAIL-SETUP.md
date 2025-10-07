# Email Setup Guide

## Overview

Your site now has email functionality to send professional estimates and invoices to customers!

## What You Get

✅ **Email Estimates** - Send beautiful HTML estimates to customers
✅ **Email Invoices** - Send professional invoices with payment status
✅ **Email Tracking** - All sent emails are logged in your database
✅ **Professional Templates** - Branded email templates with your logo and colors

## Setup Instructions

### Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Click "Sign Up" (it's free!)
3. Verify your email address

### Step 2: Get Your API Key

1. Log in to Resend dashboard
2. Go to "API Keys" in the sidebar
3. Click "Create API Key"
4. Give it a name like "Seal'n & Stripe'n Production"
5. Click "Create"
6. **COPY THE API KEY** (you won't see it again!)

### Step 3: Add API Key to Local Environment

1. Open your `.env.local` file
2. Add this line:
   ```
   RESEND_API_KEY=re_your_key_here
   ```

### Step 4: Add API Key to Vercel

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_your_key_here`
   - **Environments:** Check all three (Production, Preview, Development)
5. Click "Save"

### Step 5: Verify Your Domain (Optional but Recommended)

**Why?** Without a verified domain, emails will be sent from `onboarding@resend.dev`. With verification, they'll be from `gary@sealnstripenspecialist.com`.

#### Steps:

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter: `sealnstripenspecialist.com`
4. Resend will give you DNS records to add
5. Add these DNS records to your domain registrar:
   - **DKIM** record (for authentication)
   - **SPF** record (for spam protection)
   - **DMARC** record (for security)

6. Wait for verification (can take up to 48 hours, usually instant)

#### Where to Add DNS Records:

- **If your domain is with GoDaddy:**
  1. Log in to GoDaddy
  2. Go to "My Products" → "Domains"
  3. Click DNS
  4. Add the records Resend provided

- **If your domain is with Namecheap/Cloudflare/etc:**
  - Similar process in their DNS settings

### Step 6: Update Email Templates (After Domain Verification)

Once your domain is verified, update these files:

**File: `src/app/api/send-estimate/route.ts`**

Change line 80:
```typescript
from: 'Seal\'n & Stripe\'n Specialist <gary@sealnstripenspecialist.com>',
```

**File: `src/app/api/send-invoice/route.ts`**

Change line 94:
```typescript
from: 'Seal\'n & Stripe\'n Specialist <gary@sealnstripenspecialist.com>',
```

### Step 7: Test It!

1. Create a test estimate
2. Click the **"📧 Send Email"** button
3. Check the customer's email inbox
4. Verify the email looks professional

## How to Use

### Sending an Estimate:

1. Go to `/admin/estimates`
2. Find the estimate you want to send
3. Click **"📧 Send Email"**
4. Confirm the recipient email
5. Done! The customer will receive a beautiful HTML email

### Sending an Invoice:

1. Go to `/admin/invoices`
2. Find the invoice you want to send
3. Click **"📧 Send Email"**
4. Confirm the recipient email
5. Done! The customer will receive the invoice

## Email Tracking

All sent emails are automatically logged in your database:

**Table:** `email_logs`

You can view logs by running this in Supabase SQL Editor:
```sql
SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 10;
```

## Troubleshooting

### "Failed to send email"

**Check:**
1. Is `RESEND_API_KEY` set in `.env.local`?
2. Is `RESEND_API_KEY` set in Vercel environment variables?
3. Did you redeploy after adding the env variable?
4. Is the customer's email address valid?

### Emails going to spam

**Solutions:**
1. Verify your domain in Resend (see Step 5)
2. Add DKIM, SPF, and DMARC records
3. Ask recipients to mark your emails as "Not Spam"
4. Send a few test emails to build reputation

### "Customer email not found"

**Fix:** Make sure customers have email addresses in your database:
1. Go to `/admin/customers`
2. Edit the customer
3. Add their email address
4. Save

## Resend Free Tier Limits

- **100 emails per day**
- **3,000 emails per month**
- **Unlimited API keys**
- **Domain verification included**

For most small businesses, this is plenty!

If you need more, Resend has affordable paid plans.

## Email Template Customization

Want to customize the email appearance?

**Edit these files:**
- `src/app/api/send-estimate/route.ts` (lines 30-120)
- `src/app/api/send-invoice/route.ts` (lines 31-140)

You can change:
- Colors
- Logo
- Layout
- Text
- Add your own styling

## Future Enhancements

Consider adding:
- [ ] PDF attachment generation
- [ ] Email scheduling (send later)
- [ ] Email templates for other types (quotes, receipts)
- [ ] CC/BCC functionality
- [ ] Email open tracking
- [ ] Automated reminder emails for unpaid invoices

## Support

- **Resend Docs:** https://resend.com/docs
- **Resend Status:** https://status.resend.com
- **Email Issues:** Check Resend dashboard for delivery status

---

**You're all set! 🎉** Your customers can now receive professional estimates and invoices via email.
