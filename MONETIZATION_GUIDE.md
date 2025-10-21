# Pluggist Monetization Implementation Guide

## 🚀 Quick Revenue Activation (30 Minutes)

### Phase 1: Stripe Setup (10 minutes)

1. **Create Stripe Account** (if you haven't already)
   - Go to https://stripe.com
   - Sign up for a new account
   - Complete business verification

2. **Get API Keys**
   ```bash
   # Navigate to: Dashboard → Developers → API keys
   # Copy these to your .env.local:
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Create Products & Pricing**

   Navigate to: Dashboard → Products → Add Product

   **User Subscriptions:**
   - **Premium Plan**
     - Name: "Pluggist Premium"
     - Price: $9.99/month (recurring)
     - Price ID → Copy to `STRIPE_PREMIUM_PRICE_ID`

   - **Business Plan**
     - Name: "Pluggist Business"
     - Price: $49.99/month (recurring)
     - Price ID → Copy to `STRIPE_BUSINESS_PRICE_ID`

   **Partner Subscriptions:**
   - **Starter Partner**
     - Name: "Partner Starter"
     - Price: $299/month (recurring)
     - Price ID → Copy to `STRIPE_PARTNER_STARTER_PRICE_ID`

   - **Premium Partner**
     - Name: "Partner Premium"
     - Price: $599/month (recurring)
     - Price ID → Copy to `STRIPE_PARTNER_PREMIUM_PRICE_ID`

   - **Enterprise Partner**
     - Name: "Partner Enterprise"
     - Price: $999/month (recurring)
     - Price ID → Copy to `STRIPE_PARTNER_ENTERPRISE_PRICE_ID`

4. **Set Up Webhook** (CRITICAL!)
   ```bash
   # Navigate to: Dashboard → Developers → Webhooks → Add endpoint

   # Endpoint URL (replace with your domain):
   https://your-domain.com/api/webhooks/stripe

   # Select events to listen to:
   ✓ checkout.session.completed
   ✓ customer.subscription.created
   ✓ customer.subscription.updated
   ✓ customer.subscription.deleted
   ✓ invoice.paid
   ✓ invoice.payment_failed

   # Copy webhook signing secret to:
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. **Enable Stripe Connect** (for user payouts)
   ```bash
   # Navigate to: Dashboard → Connect → Get started
   # Enable Express accounts
   # This allows you to pay out user earnings
   ```

---

### Phase 2: Deploy Payment Infrastructure (10 minutes)

1. **Update Environment Variables**
   ```bash
   cp .env.example .env.local
   # Fill in all Stripe values from Phase 1
   ```

2. **Build and Test Locally**
   ```bash
   npm install
   npm run build
   npm run dev
   ```

3. **Test Payment Flow**
   - Visit: http://localhost:3000/subscription
   - Use Stripe test card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Verify webhook receives `checkout.session.completed`

---

### Phase 3: Go Live (10 minutes)

1. **Deploy to Production**
   ```bash
   # Vercel (recommended)
   vercel deploy --prod

   # Add environment variables in Vercel dashboard
   # Settings → Environment Variables → Add all from .env.local
   ```

2. **Switch to Live Mode in Stripe**
   ```bash
   # Dashboard → Developers → API keys → Live mode
   # Get live keys and update production env vars:
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

   # Update webhook for production:
   https://pluggist.com/api/webhooks/stripe
   STRIPE_WEBHOOK_SECRET=whsec_live_...
   ```

3. **Verify Production Payment**
   - Use real card or Stripe test mode
   - Check Stripe Dashboard for successful payment
   - Verify user shows as subscribed in database

---

## 💰 Revenue Streams Implemented

### 1. User Subscriptions ($9.99-$49.99/mo)

**Features by Tier:**

| Feature | Free | Premium ($9.99) | Business ($49.99) |
|---------|------|-----------------|-------------------|
| Basic search | ✓ | ✓ | ✓ |
| Real-time availability | ✗ | ✓ | ✓ |
| Advanced trip planning | ✗ | ✓ | ✓ |
| Exclusive deals | ✗ | ✓ | ✓ |
| Station management | ✗ | ✗ | ✓ |
| Analytics dashboard | ✗ | ✗ | ✓ |
| API access | ✗ | ✗ | ✓ |

**API Endpoints:**
- `POST /api/create-checkout-session` - Start subscription
- `POST /api/stripe/cancel-subscription` - Cancel subscription
- `POST /api/stripe/create-portal-session` - Manage subscription

**Implementation:**
```typescript
// Check if user has premium access
import { hasFeatureAccess } from '@/middleware/premium-check';

const canAccess = await hasFeatureAccess(userId, 'REAL_TIME_AVAILABILITY');
if (!canAccess) {
  // Show upgrade prompt
}
```

---

### 2. Partner Business Program ($299-$999/mo)

**Partner Tiers:**

| Tier | Price | Max Deals | Features |
|------|-------|-----------|----------|
| Starter | $299/mo | 5 | Basic listing, deals, referrals |
| Premium | $599/mo | 20 | Featured listing, analytics, priority placement |
| Enterprise | $999/mo | Unlimited | Multi-location, API, custom reporting, revenue sharing |

**Trial Period:** 14 days free for all partner tiers

**API Endpoints:**
- `POST /api/partners/onboard` - Sign up new partner
- `POST /api/partners/deals` - Create deal
- `GET /api/partners/deals?partner_id=X` - Get partner deals
- `PATCH /api/partners/deals` - Update deal
- `DELETE /api/partners/deals` - Deactivate deal

**Partner Dashboard:** `/partners/dashboard`

---

### 3. Deal Redemption System

**How It Works:**
1. EV driver sees deal while charging
2. Clicks "Redeem Deal"
3. Gets QR code (valid 15 minutes)
4. Shows QR code at business
5. Partner scans code
6. Deal marked as redeemed
7. User earns points/cash back

**API Endpoints:**
- `POST /api/deals/redeem` - Generate QR code
- `PATCH /api/deals/redeem` - Verify and confirm redemption
- `GET /api/deals/redeem?user_id=X` - Get redemption history

**QR Code Format:**
```
https://pluggist.com/partners/verify-deal?code=abc123def456
```

---

### 4. User Earnings & Payouts

**Earning Opportunities:**
- Installation referrals: $50-125 per install
- Deal redemptions: 1% of discount value (max $5)
- Station reports: $2-5 per accepted report
- Reviews: $0.50 per verified review

**Payout System:**
- Minimum payout: $25
- Powered by Stripe Connect
- 2-3 business day processing
- No fees for users

**API Endpoints:**
- `GET /api/user-earnings?user_id=X` - Get earnings balance
- `POST /api/payouts` - Request payout
- `GET /api/payouts?user_id=X` - Get payout history

---

## 📊 Analytics & Tracking

**Revenue Metrics Tracked:**
- Total MRR (Monthly Recurring Revenue)
- Subscription conversion rate
- Partner acquisition cost
- Deal redemption rate
- User earnings paid out
- Average revenue per user (ARPU)

**Conversion Tracking:**
```typescript
// Track subscription purchase
import { trackConversion } from '@/lib/analytics';

trackConversion('subscription', {
  plan: 'premium',
  value: 9.99,
  currency: 'USD',
});
```

---

## 🎯 Revenue Targets

### Month 1 Goals
- 50 premium subscriptions = $500/mo MRR
- 10 partners (Starter) = $2,990/mo MRR
- **Total Target: $3,490/mo MRR**

### Month 3 Goals
- 200 premium subscriptions = $2,000/mo MRR
- 30 partners (avg $450/mo) = $13,500/mo MRR
- **Total Target: $15,500/mo MRR**

### Month 6 Goals
- 500 premium subscriptions = $5,000/mo MRR
- 50 business subscriptions = $2,500/mo MRR
- 75 partners (avg $500/mo) = $37,500/mo MRR
- **Total Target: $45,000/mo MRR**

---

## 🚀 Sales & Marketing Actions

### Immediate (Week 1)

1. **Partner Outreach**
   ```
   Target: Coffee shops, restaurants within 1 mile of charging stations

   Email Template:
   "Are you near a Tesla Supercharger or EV charging station?

   We can send you 10-30 hungry EV drivers per day who are waiting
   15-45 minutes for their car to charge.

   First month free - then just $299/mo.

   Interested? Sign up: pluggist.com/for-business"
   ```

2. **User Acquisition**
   - Post in EV forums (r/electricvehicles, TeslaMotorsClub)
   - Facebook groups (Tesla Owners, EV Enthusiasts)
   - Target Google Ads: "EV charging near me"

3. **Content Marketing**
   - Blog: "How to make money while your EV charges"
   - Video: "I saved $50 during one charging session"
   - Social proof: Share first successful redemptions

### Month 1-3

4. **Partnership with Charging Networks**
   - ChargePoint, EVgo, Electrify America
   - Offer co-branded deals
   - Revenue sharing: 20% of partner subscriptions

5. **Referral Program**
   - Users earn $10 for each friend who subscribes
   - Partners earn $100 for each new partner referral

6. **Premium Feature Launch**
   - Real-time availability (drives subscriptions)
   - Advanced trip planning (drives subscriptions)
   - Exclusive deals (drives engagement)

---

## 💡 Optimization Tips

### Increase Conversion

1. **Add Social Proof**
   ```tsx
   "Join 1,247 EV drivers saving money while charging"
   "Our partners have given out $12,450 in deals this month"
   ```

2. **Limited Time Offers**
   ```
   "First 100 partners get 50% off for 3 months"
   "Subscribe by Friday - get 2 months free"
   ```

3. **Risk Reversal**
   ```
   "30-day money-back guarantee"
   "Cancel anytime, no questions asked"
   "14-day free trial for all partners"
   ```

### Reduce Churn

1. **Engagement Emails**
   - Weekly deal summary
   - Charging savings report
   - New nearby partners

2. **Win-Back Campaigns**
   - 50% off for 3 months if you resubscribe
   - New features launched since you left

3. **Partner Success**
   - Monthly performance reports
   - Optimization recommendations
   - Success stories from other partners

---

## 🔧 Technical Maintenance

### Weekly Tasks
- Monitor Stripe webhook errors
- Check failed payments
- Review redemption fraud patterns
- Verify payout queue processing

### Monthly Tasks
- Analyze revenue metrics
- A/B test pricing tiers
- Review and update deal limits
- Optimize conversion funnels

### Quarterly Tasks
- Review Stripe fees (negotiate if >$50k/mo)
- Audit feature gate effectiveness
- Survey users for feature requests
- Evaluate new revenue streams

---

## 📈 Growth Levers

### Quick Wins (This Week)
1. Email existing users about premium features
2. Reach out to 10 businesses near charging stations
3. Post in 3 EV communities
4. Set up Google Ads ($50/day budget)

### Medium Term (This Month)
1. Partner with 2 charging networks
2. Launch referral program
3. Add premium features
4. Create video testimonials

### Long Term (This Quarter)
1. Mobile app launch
2. Enterprise partnerships
3. International expansion
4. API marketplace

---

## 🎁 Bonus: Email Templates

### Partner Outreach Email

```
Subject: Turn EV drivers into customers - $0 upfront

Hi [Business Name],

I noticed you're located near [Charging Station Name].

Did you know that EV drivers spend 15-45 minutes waiting while
their car charges? That's 10-30 potential customers per day sitting
idle with nothing to do.

Pluggist sends these drivers exclusive deals from your business
right when they start charging.

Results from similar businesses:
• Coffee shop: 47 new customers in first month
• Restaurant: $3,200 additional revenue
• Retail store: 23% increase in foot traffic

**Try it free for 14 days - then $299/month.**

Sign up in 2 minutes: https://pluggist.com/for-business

Best,
[Your Name]
Pluggist Partner Success
```

### User Upgrade Email

```
Subject: You're missing out on $50+ in deals

Hi [Name],

We noticed you've been using Pluggist to find charging stations.

Did you know Premium members get access to exclusive deals worth
$50+ every month?

Last week alone:
• $20 off at restaurants while charging
• Free coffee at 3 coffee shops
• 15% off retail near stations

**Premium is just $9.99/month - but this week only: $6.99/month**

Most users save $30+ in their first week.

Try it free for 7 days: https://pluggist.com/premium

See you charging soon,
The Pluggist Team
```

---

## ✅ Pre-Launch Checklist

Before going live with payments:

- [ ] Stripe account verified
- [ ] All product prices created in Stripe
- [ ] Webhook endpoint configured and tested
- [ ] Environment variables set in production
- [ ] Test payment flow end-to-end
- [ ] Subscription cancellation tested
- [ ] Partner onboarding tested
- [ ] Deal creation and redemption tested
- [ ] Payout flow tested (use Stripe test mode)
- [ ] Analytics tracking verified
- [ ] Terms of service updated
- [ ] Privacy policy updated
- [ ] Refund policy published
- [ ] Customer support email set up
- [ ] Bank account connected to Stripe
- [ ] First 5 partners lined up
- [ ] First 10 users ready to convert

---

## 🆘 Support & Troubleshooting

### Common Issues

**Webhook not receiving events:**
```bash
# Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

**Payment succeeds but user not upgraded:**
- Check webhook secret is correct
- Verify webhook events are selected
- Check database for subscription record
- Review webhook logs in Stripe Dashboard

**Partner can't create deals:**
- Verify partner status is 'active'
- Check if deal limit reached for tier
- Ensure subscription is not past_due

**Payout fails:**
- Verify Stripe Connect account is verified
- Check minimum payout amount ($25)
- Ensure user has sufficient earnings balance
- Review Stripe transfer errors

---

## 🎯 Success Metrics Dashboard

Track these KPIs:

```
Monthly Recurring Revenue (MRR): $________
User Subscriptions: _____ Premium + _____ Business
Partner Subscriptions: _____ Starter + _____ Premium + _____ Enterprise
Avg Revenue Per User: $______
Customer Acquisition Cost: $______
Lifetime Value: $______
Churn Rate: ____%
Deal Redemption Rate: ____%
```

---

**You're ready to make money! 🚀**

Next step: Complete Phase 1 (Stripe Setup) above and start signing up partners!

Questions? Issues? Create an issue on GitHub or email support@pluggist.com
