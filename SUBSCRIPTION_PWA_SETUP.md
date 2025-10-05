# Area Helper Pro - Subscription & PWA Setup

## Overview
Area Helper is now a paid PWA (Progressive Web App) with subscription-based access.

## Database Setup
1. Run the SQL schema in Supabase:
   ```bash
   # Execute subscriptions-schema.sql in Supabase SQL Editor
   ```

This creates:
- `subscription_plans` - Pricing tiers
- `user_subscriptions` - User subscription status
- `payment_history` - Transaction records
- `app_downloads` - Download tracking

## Subscription Plans
Three tiers are pre-configured:

1. **Monthly** - $9.99/month
   - Unlimited measurements
   - CSV/JSON export
   - Address tracking
   - Smooth drawing tools
   - Cloud save

2. **Yearly** - $95.99/year (20% off)
   - All Monthly features
   - Priority support

3. **Lifetime** - $249.99 one-time
   - All features forever
   - Priority support
   - All future updates

## User Flow

### 1. Subscribe Page (`/subscribe`)
- View available plans
- Select and subscribe
- Requires login (redirects if not logged in)
- Currently uses demo subscription (Stripe integration coming soon)

### 2. Download Page (`/area-helper-app`)
- **Gated access** - checks for active subscription
- Displays subscription status
- PWA install button
- Installation instructions for all platforms

### 3. PWA App (`/area-helper-pwa`)
- Full-screen area measurement tool
- **Access verification** on every load
- Redirects if subscription expired
- Works offline after installation

### 4. Admin Dashboard (`/admin/area-helper`)
- Available for logged-in admins
- No subscription required for admin access
- Full-featured area helper

## PWA Features

### Installation
- **Android**: Add to Home Screen
- **iOS**: Share → Add to Home Screen
- **Desktop**: Browser install prompt

### Capabilities
- ✅ Works offline (after first load)
- ✅ Installable on home screen
- ✅ Full-screen experience
- ✅ Auto-updates when online

### Manifest Configuration
Located at `/public/manifest.json`:
- App name: "Area Helper Pro"
- Theme color: Blue (#3b82f6)
- Standalone display mode
- Icons configured

## Next Steps

### 1. Test the Flow
```
1. Visit /subscribe
2. Create subscription (demo mode)
3. Go to /area-helper-app
4. Click "Install App"
5. Test the PWA
```

### 2. Integrate Stripe (Recommended)
```bash
npm install @stripe/stripe-js stripe
```

Update `/subscribe` page to:
- Create Stripe Checkout Session
- Handle webhooks for subscription events
- Update subscription status automatically

### 3. Deploy to Vercel
```bash
git add .
git commit -m "Add subscription-based PWA"
git push
```

Vercel will automatically:
- Enable PWA features
- Serve manifest.json
- Handle HTTPS (required for PWA)

### 4. Test PWA Installation
Once deployed to Vercel:
1. Visit the deployed URL on mobile
2. Browser will show "Install" prompt
3. Test offline functionality
4. Verify subscription checking works

## Security Features
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only see their own subscriptions
- ✅ Subscription check on every PWA load
- ✅ Protected routes with authentication
- ✅ Secure function for subscription verification

## Monetization Strategy
- **Monthly recurring revenue** from subscriptions
- **Premium features** locked behind paywall
- **Admin access** remains free for business owner
- **Track downloads** for analytics
- **Future**: Add more paid tools/components

## File Structure
```
src/app/
├── subscribe/page.tsx          # Subscription purchase page
├── area-helper-app/page.tsx    # Gated PWA download page
├── area-helper-pwa/page.tsx    # Actual PWA app (subscription-checked)
└── admin/area-helper/page.tsx  # Admin version (no subscription)

public/
├── manifest.json               # PWA configuration
└── area-bid-helper.js          # Web component

subscriptions-schema.sql        # Database schema
```

## Support & Documentation
- Cancel anytime (no lock-in)
- 30-day money-back guarantee
- Email support for subscribers
- Priority support for yearly/lifetime

## Future Enhancements
1. **Stripe Integration** - Real payment processing
2. **Android APK** - Google Play Store submission
3. **iOS Native App** - App Store submission
4. **Team Plans** - Multi-user subscriptions
5. **API Access** - For enterprise customers
6. **More Tools** - Add other paid components
