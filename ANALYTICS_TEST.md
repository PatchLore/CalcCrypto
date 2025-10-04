# Google Analytics Test Checklist

## ✅ Setup Complete

### 1. Analytics Library Created
- ✅ `src/lib/analytics.ts` - Complete tracking functions
- ✅ `src/components/GoogleAnalytics.tsx` - GA4 initialization component
- ✅ Added to root layout for automatic initialization

### 2. Tracking Implemented
- ✅ **Page Views** - Automatic tracking on route changes
- ✅ **Calculator Usage** - All 4 calculators track calculations
- ✅ **Button Clicks** - Landing page and calculator buttons
- ✅ **Navigation** - Link clicks and page transitions

### 3. Calculator Tracking
- ✅ **Profit/Loss Calculator** - Tracks buy/sell calculations
- ✅ **DCA Calculator** - Tracks investment strategy calculations  
- ✅ **Staking Calculator** - Tracks passive income calculations
- ✅ **Mining Calculator** - Tracks profitability calculations

### 4. Landing Page Tracking
- ✅ **Get Started Button** - Primary CTA tracking
- ✅ **View All Calculators** - Secondary CTA tracking
- ✅ **Calculator Cards** - Featured calculator clicks

## 🧪 Testing Steps

### 1. Environment Setup
```bash
# Create .env.local file with your GA4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Local Testing
1. Start development server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Open browser DevTools → Network tab
4. Look for requests to `googletagmanager.com`
5. Check for `gtag` function calls in console

### 3. Real-time Testing
1. Set up GA4 property with localhost as data stream
2. Visit your local site
3. Check Google Analytics Real-time reports
4. Perform test calculations
5. Verify events appear in real-time

### 4. Production Testing
1. Deploy with environment variable set
2. Visit live site
3. Check GA4 Real-time reports
4. Test all calculator functions
5. Verify tracking data appears

## 📊 Expected Events

### Automatic Events
- `page_view` - Every page visit
- `session_start` - New user sessions

### Custom Events
- `calculation` - Calculator usage
- `click` - Button interactions
- `navigation` - Page transitions

### Calculator-Specific Events
- `profit_loss_calculation` - Trading analysis
- `dca_calculation` - Investment planning
- `staking_calculation` - Passive income
- `mining_calculation` - Hardware ROI

## 🔍 Debugging

### No Data Showing?
1. Check Measurement ID is correct
2. Verify environment variable is set
3. Check browser console for errors
4. Ensure GA4 property is active
5. Wait 24-48 hours for data

### Console Errors?
1. Check for `gtag is not defined` errors
2. Verify GoogleAnalytics component is loaded
3. Check network requests to Google
4. Ensure no ad blockers are interfering

## 🚀 Ready for Production

Your CrypCal analytics setup is complete and ready for production deployment! 

**Next Steps:**
1. Get your GA4 Measurement ID from Google Analytics
2. Set the environment variable in your deployment platform
3. Deploy and start collecting valuable user insights!

The analytics will help you understand:
- Which calculators are most popular
- User engagement patterns
- Conversion rates
- Performance metrics
- User behavior insights
