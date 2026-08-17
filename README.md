# CalcCrypto - Professional Crypto Calculators

A modern, professional cryptocurrency calculator web application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Professional Design**: Modern, responsive UI with crypto-themed color palette
- **Dark Mode Ready**: Built-in dark mode support with smooth transitions
- **Multiple Calculators**: Comprehensive suite of crypto calculation tools
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Performance**: Optimized with Next.js 14 App Router
- **Mobile First**: Responsive design that works on all devices

## 🧮 Available Calculators

### Featured Calculators
- **Profit/Loss Calculator**: Calculate trading profits and losses with fees
- **DCA Calculator**: Dollar Cost Averaging strategy calculator
- **Staking Calculator**: Calculate staking rewards with compound interest

### Additional Calculators
- **Mining Calculator**: Cryptocurrency mining profitability
- **Tax Calculator**: Crypto tax implications
- **Portfolio Tracker**: Track and analyze your crypto portfolio
- **Currency Converter**: Convert between different cryptocurrencies

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom crypto theme
- **Fonts**: Inter (sans-serif) and JetBrains Mono (monospace)
- **Icons**: Emoji-based icons for simplicity
- **State Management**: React hooks (useState, useEffect)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── calculators/        # Calculator pages
│   │   └── profit-loss/    # Profit/Loss calculator
│   ├── globals.css         # Global styles with crypto theme
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx      # Custom button component
│   │   ├── Input.tsx       # Custom input component
│   │   ├── Card.tsx        # Card components
│   │   └── index.ts        # Component exports
│   └── calculators/        # Calculator-specific components
├── lib/                    # Utility functions and constants
│   ├── formulas.ts         # Calculation formulas
│   ├── utils.ts            # General utility functions
│   ├── constants.ts        # App constants and configurations
│   └── index.ts            # Library exports
└── types/                  # TypeScript type definitions
    ├── crypto.ts           # Crypto-related types
    └── index.ts            # Type exports
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions and branding
- **Bitcoin**: Orange tones for Bitcoin-related features
- **Ethereum**: Blue tones for Ethereum-related features
- **Success**: Green tones for positive values
- **Warning**: Yellow tones for warnings
- **Error**: Red tones for negative values
- **Dark Mode**: Comprehensive dark theme support

### Typography
- **Primary Font**: Inter (clean, modern sans-serif)
- **Monospace Font**: JetBrains Mono (for numbers and code)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypcal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized typography for all screen sizes
- Adaptive navigation

## 🔒 Privacy & Security

- **Local Calculations**: All calculations are performed client-side
- **No Data Collection**: No user data is stored or transmitted
- **Secure**: No external API calls for calculations
- **Open Source**: Transparent codebase for security review

## 🎯 Future Enhancements

- [ ] Real-time cryptocurrency price integration
- [ ] Portfolio tracking with historical data
- [ ] Advanced charting and visualization
- [ ] Export functionality for calculations
- [ ] User accounts and saved calculations
- [ ] Additional calculator types
- [ ] API for third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- The crypto community for inspiration and feedback

---

**CalcCrypto** - Professional cryptocurrency calculators for traders and investors.