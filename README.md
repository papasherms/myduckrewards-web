# 🦆 MyDuckRewards

A gamified loyalty rewards platform that transforms collecting rubber ducks from claw machines into valuable local business discounts and instant prizes.

## 🚀 Live Site

**Production URL:** [https://myduckrewards.com](https://myduckrewards.com)  
**Deployment:** AWS Amplify with GitHub CI/CD  
**Status:** ✅ Production Ready

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Database Setup](#-database-setup)
- [Development](#-development)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

## ✨ Features

### Authentication & User Management
- **Multi-tier Authentication**
  - Customer registration with email verification
  - Business partnership applications with admin approval workflow
  - Admin user management with role-based access
- **Password Management**
  - Secure password reset via email
  - Session persistence with Supabase Auth
  - Automatic logout on token expiry

### Dashboard System
- **Customer Dashboard** (`/dashboard/customer`)
  - Duck collection tracking with visual display
  - Redemption history and coupon management
  - Profile completion tracking (percentage-based)
  - Location-based rewards discovery
  
- **Business Dashboard** (`/dashboard/business`)
  - Real-time analytics and metrics
  - Duck Alert creation for targeted marketing
  - Location management for multiple outlets
  - Campaign performance tracking
  
- **Admin Dashboard** (`/dashboard/admin`)
  - User management with suspension/deletion capabilities
  - Business approval/rejection workflow
  - Location and inventory management
  - System metrics and recent activity tracking
  - Custom notification system with toast notifications
  - Admin-level operations with service role key support

### UI/UX Features
- **Dark/Light Mode Toggle**
  - System-wide theme switching
  - Persistent preference storage
  - Mobile-optimized toggle in header
  
- **Interactive Location Map**
  - Google Maps integration with custom duck markers
  - Location search by ZIP code
  - Current location detection
  - Directions integration
  
- **Responsive Design**
  - Mobile-first approach
  - Touch-optimized interfaces
  - Progressive web app capabilities

### Business Features
- **Approval Workflow**
  ```
  Application → Pending → Admin Review → Approved/Rejected
  ```
- **Membership Tiers**: Basic, Trade, Premium
- **Location-based Marketing**: 5-mile radius targeting
- **Duck Alert System**: Push notifications for nearby offers

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing fast builds
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Google Maps API** for location services

### Backend & Infrastructure
- **Supabase**
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication service
  - Service role key for admin operations
- **AWS Amplify**
  - Hosting & CI/CD
  - Environment management
  - Custom domain SSL

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety
- **Git** for version control
- **npm** for package management

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- Git
- Supabase account
- Google Cloud account (for Maps API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/myduckrewards-web.git
   cd myduckrewards-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔑 Environment Setup

### Supabase Configuration
1. Create a new Supabase project
2. Run the database setup script: `sql-scripts/complete-database-setup.sql`
3. Configure authentication providers
4. Set up email templates from `email-templates/` directory
5. Get your service role key from Settings → API

### Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
4. Create API key and restrict it:
   - HTTP referrers: `localhost:*`, `myduckrewards.com/*`
   - API restrictions: Maps JavaScript API, Places API

## 🗄️ Database Setup

### Schema Overview
```sql
-- Main Tables
users           -- User profiles with extended info
businesses      -- Business partnerships
locations       -- Claw machine locations
ducks          -- Duck inventory
user_ducks     -- User collections
redemptions    -- Reward redemptions
duck_alerts    -- Marketing campaigns
```

### Key RLS Policies
- Users can only view/edit their own profiles
- Businesses require admin approval to access system
- Admins have full access to all tables (via service role)
- Public can view active locations

### Setup Instructions
1. Run `sql-scripts/complete-database-setup.sql` in Supabase SQL editor
2. Run `sql-scripts/add-suspension-columns.sql` for user suspension features
3. Configure RLS policies as needed
4. Set up database triggers for automated workflows

## 💻 Development

### Available Scripts
```bash
npm run dev      # Start development server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run type-check # TypeScript type checking
```

### Code Style Guidelines
- **Components**: Use functional components with TypeScript
- **Styling**: Tailwind classes with consistent patterns
- **Forms**: Use controlled components with validation
- **API Calls**: Centralize in service files
- **Error Handling**: Use try-catch with user notifications
- **Admin Operations**: Use supabase-admin client for RLS bypass

### UI/UX Standards
All form inputs should use consistent styling:
```css
className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
           rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 
           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
           transition-colors appearance-none"
```

Button variants:
- **Primary**: Orange gradient for main CTAs
- **Secondary**: Blue for navigation/secondary actions
- **Outline**: Border-only for tertiary actions

## 🚢 Deployment

### AWS Amplify Deployment
1. Connect GitHub repository to AWS Amplify
2. Configure environment variables in Amplify console
3. Set build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] Service role key added for admin operations
- [ ] SSL certificate active
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Email service connected

## 📁 Project Structure

```
myduckrewards-web/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AnimatedButton.tsx
│   │   ├── AnimatedCard.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── GoogleLocationMap.tsx
│   │   ├── Notification.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── AdminModals.tsx
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useNotification.tsx
│   │   └── usePageTitle.ts
│   ├── lib/              # External service configs
│   │   ├── supabase.ts
│   │   ├── supabase-admin.ts
│   │   └── supabase-business-fix.ts
│   ├── pages/            # Route components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Business.tsx
│   │   ├── Contact.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Locations.tsx
│   │   ├── SignIn.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── CustomerSignup.tsx
│   │   ├── BusinessSignup.tsx
│   │   ├── CustomerDashboard.tsx
│   │   ├── BusinessDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── types/            # TypeScript definitions
│   └── App.tsx           # Main app component
├── email-templates/      # Supabase email templates
│   ├── confirm-signup.html
│   ├── invite-user.html
│   ├── magic-link.html
│   ├── change-email.html
│   ├── reset-password.html
│   └── reauthentication.html
├── sql-scripts/         # Database setup and migrations
│   ├── complete-database-setup.sql
│   ├── add-suspension-columns.sql
│   ├── check-suspension-columns.sql
│   └── archive/        # Old migration scripts
└── CLAUDE.md           # AI assistant context file
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `POST /auth/reset-password` - Password reset

### RPC Functions
- `approve_business(business_id)` - Approve business application
- `reject_business(business_id, reason)` - Reject business application
- `delete_user_admin(user_id)` - Admin user deletion

### Admin Functions (via service role)
- `getAllUsers()` - Fetch all users (bypasses RLS)
- `getAllBusinesses()` - Fetch all businesses
- `suspendUser(userId, reason, adminId)` - Suspend user account
- `unsuspendUser(userId)` - Reactivate suspended user
- `updateUserRole(userId, role)` - Change user type
- `getSystemStats()` - Get platform statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Message Format
```
type: subject

body (optional)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

## 🐛 Known Issues & Solutions

### Issue: Business Signup RLS Error
**Solution**: Implemented approval workflow - businesses start as pending

### Issue: Dark Mode Visibility
**Solution**: Added gradient backgrounds and proper contrast classes

### Issue: User Suspension
**Solution**: Admin client with service role key for RLS bypass

## 📈 Next Steps

### Immediate Priorities
- [ ] Payment processing (Stripe integration)
- [ ] Email service integration (SendGrid/Resend)
- [ ] Duck QR code scanning implementation
- [ ] Push notifications setup

### Future Enhancements
- [ ] Analytics dashboard with real-time metrics
- [ ] Automated email campaigns
- [ ] Mobile app (React Native)
- [ ] A/B testing framework
- [ ] Referral program
- [ ] Loyalty points system

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 👥 Team

- **Development**: Justin Sherman
- **AI Assistant**: Claude (Anthropic)

## 📧 Contact

For questions or support, please contact:
- Email: support@myduckrewards.com
- Website: https://myduckrewards.com

---

Built with ❤️ and 🦆 in Michigan | Last Updated: December 2024