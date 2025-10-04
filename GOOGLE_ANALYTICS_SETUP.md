# Google Analytics Setup Guide for CrypCal

## 🎯 Quick Setup

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create a new account for CrypCal
4. Set up a new property (website)
5. Choose "Web" as your platform

### 2. Get Your Measurement ID
1. In your GA4 property, go to "Admin" (gear icon)
2. Under "Property", click "Data Streams"
3. Click on your web stream
4. Copy your "Measurement ID" (starts with G-)

### 3. Add to Your Environment Variables
Create a `.env.local` file in your project root:

```bash
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YK1TEZY3SF
```

✅ **Your Measurement ID is already configured: G-YK1TEZY3SF**

### 4. Deploy and Test
1. Deploy your app with the environment variable
2. Visit your website
3. Check Google Analytics Real-time reports to see data

## 📊 What's Being Tracked

### Automatic Tracking:
- ✅ **Page views** - All page visits
- ✅ **Route changes** - Navigation between pages
- ✅ **User sessions** - Visit duration and behavior

### Calculator Events:
- ✅ **Calculator usage** - Which calculators are used most
- ✅ **Calculation events** - When users perform calculations
- ✅ **Button clicks** - Calculate button interactions
- ✅ **Input data** - Anonymous usage patterns

### Custom Events:
- 📈 **Profit/Loss calculations** - Trading analysis usage
- 💰 **DCA calculations** - Investment strategy usage
- 🏦 **Staking calculations** - Passive income planning
- ⛏️ **Mining calculations** - Hardware profitability analysis

## 🔧 Advanced Configuration

### Custom Event Tracking
The analytics system tracks:
- Calculator type and usage frequency
- Input values (anonymized)
- User interaction patterns
- Error tracking

### Privacy Compliance
- No personal data is collected
- All tracking is anonymous
- GDPR compliant implementation
- Users can opt-out via browser settings

## 🚀 Production Deployment

### Vercel
```bash
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID
# Enter your GA4 Measurement ID when prompted
```

### Netlify
1. Go to Site settings > Environment variables
2. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` with your Measurement ID

### Railway
```bash
railway variables set NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 📈 Analytics Dashboard

Once set up, you'll see:
- **Real-time users** - Current visitors
- **Page views** - Most popular pages
- **Calculator usage** - Which tools are most used
- **User flow** - How users navigate your site
- **Conversion events** - Calculator completions

## 🛠️ Troubleshooting

### No Data Showing?
1. Check your Measurement ID is correct
2. Verify environment variable is set
3. Wait 24-48 hours for data to appear
4. Check browser console for errors

### Testing Locally
1. Set up GA4 with localhost as a data stream
2. Use Google Analytics DebugView for real-time testing
3. Check browser network tab for gtag requests

## 📱 Mobile Analytics

The setup automatically tracks:
- Mobile vs desktop usage
- Device types and screen sizes
- Touch interactions
- Mobile-specific user flows

## 🎯 Key Metrics to Monitor

- **Calculator completion rate** - How many users finish calculations
- **Most popular calculators** - Which tools drive engagement
- **User retention** - Return visitor patterns
- **Page performance** - Load times and user experience
- **Error rates** - Technical issues and user problems

Your CrypCal analytics are now ready to provide valuable insights into user behavior and calculator usage! 🚀
