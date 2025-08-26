# 🦆 MyDuckRewards

A loyalty rewards platform that transforms collecting rubber ducks from claw machines into valuable local business discounts and instant prizes.

## 🚀 Live Site

**Production URL:** [https://myduckrewards.com](https://myduckrewards.com)  
**Deployment:** AWS Amplify with GitHub CI/CD

## 📊 Project Status (December 2024)

### ✅ Fully Implemented Features

- **Complete Authentication System**
  - Customer registration and login
  - Business partnership applications with approval workflow
  - Admin user management
  - Email verification
  - Password reset functionality
  - Session management with Supabase Auth

- **Three Dashboard Types**
  - **Customer Dashboard**: Collection tracking, redemptions, profile management
  - **Business Dashboard**: Analytics, Duck Alerts, location management
  - **Admin Dashboard**: User/business/location management, approval system

- **Business Approval Workflow**
  - Businesses submit applications (pending status)
  - Admin reviews and approves/rejects
  - Approved businesses gain dashboard access
  - Email notifications on status change

- **Dark/Light Mode**
  - System-wide theme toggle
  - Persistent preference (localStorage)
  - Optimized contrast for all components

- **Profile Management**
  - First-time login redirect to profile completion
  - Profile completion percentage tracking
  - Editable user information
  - Address and contact details

- **Location System**
  - Interactive location search by ZIP
  - Geolocation support
  - Location cards with directions
  - Machine capacity tracking

- **Responsive Design**
  - Mobile-optimized UI
  - Tablet and desktop layouts
  - Animated components with Framer Motion
  - Custom duck-themed styling

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: AWS Amplify
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🗄 Database Setup

### Fresh Supabase Project Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Go to SQL Editor and run the complete setup script:
   ```sql
   -- Run the contents of complete-database-setup.sql
   ```

3. This creates:
   - 7 tables (users, businesses, locations, ducks, etc.)
   - Row Level Security policies
   - Helper functions and triggers
   - Sample location data

### Create Your First Admin User

1. Sign up through the app as a regular user
2. Go to Supabase Dashboard → Table Editor → `users` table
3. Find your user and change `user_type` from 'customer' to 'admin'
4. You now have full admin access

## 🚀 Local Development

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/myduckrewards-web.git
cd myduckrewards-web

# Install dependencies
npm install

# Create .env file with your Supabase credentials
echo "VITE_SUPABASE_URL=your_supabase_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_anon_key" >> .env

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run type-check # Run TypeScript checks
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── AdminModals.tsx   # Admin CRUD modals
│   ├── AnimatedButton.tsx
│   ├── AnimatedCard.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── contexts/         # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── ThemeContext.tsx  # Dark/light mode
├── pages/           # Route components
│   ├── SignIn.tsx
│   ├── CustomerSignup.tsx
│   ├── BusinessSignup.tsx
│   ├── ForgotPassword.tsx
│   ├── CustomerDashboard.tsx
│   ├── BusinessDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── Locations.tsx
│   └── [other pages]
├── lib/             # External service configs
│   └── supabase.ts
├── types/           # TypeScript definitions
│   └── auth.ts
├── hooks/           # Custom React hooks
│   └── usePageTitle.ts
└── App.tsx          # Main app component
```

## 🔐 Authentication Flow

1. **Customer Registration**
   - Fill out form → Create auth account → Auto-create user profile
   - Email verification sent
   - First login redirects to profile completion

2. **Business Registration**
   - Submit partnership application → Status: "pending"
   - Admin reviews application
   - If approved → Business can access dashboard
   - If rejected → Reason provided, can reapply

3. **Admin Access**
   - Regular user signup → Manual promotion to admin
   - Full system management capabilities
   - Approve/reject businesses
   - Manage users and locations

## 🎨 Features Overview

### For Customers
- Track duck collection
- View and redeem rewards
- Find nearby locations
- Manage profile
- Receive Duck Alerts

### For Businesses
- Submit partnership applications
- Send Duck Alerts to customers
- View analytics dashboard
- Manage reward campaigns
- Track redemptions

### For Admins
- Approve/reject business applications
- Manage all users
- Add/edit locations
- System-wide analytics
- Database management

## 🚢 Deployment

The app is deployed on AWS Amplify with automatic CI/CD from GitHub.

### Deploy Your Own

1. Fork this repository
2. Set up AWS Amplify
3. Connect your GitHub repository
4. Add environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
5. Deploy!

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 Testing

### Test Accounts

After setting up your database, create test accounts:

1. **Customer**: Regular signup flow
2. **Business**: Partnership application → Admin approval
3. **Admin**: Regular signup → Manual role change in database

### Key User Flows to Test

1. Complete customer registration and profile
2. Submit business application and approval process
3. Admin dashboard functionality
4. Dark/light mode toggle
5. Location search
6. Password reset

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues or questions, please contact the development team.

## 🎯 Roadmap

### Coming Soon
- [ ] Payment processing (Stripe integration)
- [ ] Real-time Duck Alert notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] QR code scanning for duck collection
- [ ] Social features (leaderboards, sharing)

### Future Enhancements
- [ ] Multi-language support
- [ ] Franchise management system
- [ ] API for third-party integrations
- [ ] Automated email campaigns
- [ ] Reward marketplace

---

**MyDuckRewards** - Transforming local marketing through collectible rewards 🦆
