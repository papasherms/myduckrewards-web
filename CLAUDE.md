# Claude Code Session Guide - MyDuckRewards

*This file contains detailed context for future Claude sessions to continue development seamlessly.*

## 📊 Current Project Status (August 2025)

### ✅ COMPLETED - Fully Working
- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling System**: Tailwind CSS with custom duck theme
- **Animations**: Framer Motion with scroll triggers
- **Routing**: React Router v6 with all pages
- **Component Library**: AnimatedButton, AnimatedCard, Header, Footer
- **Database Schema**: PostgreSQL schema deployed to Supabase
- **Authentication Backend**: Supabase auth fully integrated
- **Customer Registration**: Working signup form → database
- **Business Registration**: Connected to Supabase with membership tiers
- **User Login**: Working signin form → session management
- **Header UI**: Shows user menu when authenticated, routes by user type
- **Security**: Row Level Security (RLS) policies implemented
- **Dashboard Pages**: Customer, Business, and Admin dashboards created

### ⚠️ PARTIALLY COMPLETE - Needs Connection
- **Contact Form**: Static form, needs backend/email service
- **Dashboard Features**: Static UI, needs real data integration

### 🔄 TODO - Next Priorities
1. Fetch and display real data in dashboards
2. Implement duck management system
3. Create Duck Alert functionality
4. Add payment processing (Stripe)
5. Connect contact form to email service

## 🗄️ Database Structure

### Supabase Project Details
- **URL**: rmqnqpuuisirtrdxtvni.supabase.co
- **Status**: Live with complete schema deployed
- **Schema File**: `database-schema.sql` (run successfully)

### Tables Created
1. **users** - User profiles (extends auth.users)
2. **businesses** - Business partnerships 
3. **locations** - Claw machine locations
4. **ducks** - Individual duck inventory
5. **redemptions** - Redemption tracking
6. **duck_alerts** - Marketing campaigns
7. **user_ducks** - Customer collections

### Authentication Flow
```
1. User fills signup form (Customer/Business)
2. Form calls useAuth().signUp()
3. Supabase creates auth.users record
4. Trigger auto-creates users profile
5. User gets email verification
6. After verification, can sign in
7. Header shows user menu
```

## 🧩 Key Files and Their Status

### Authentication System (✅ Complete)
- `src/lib/supabase.ts` - Client configuration + helper functions
- `src/contexts/AuthContext.tsx` - React context for auth state, includes userProfile
- `src/types/auth.ts` - TypeScript interfaces with AuthSession type
- `src/App.tsx` - Wrapped with AuthProvider, includes dashboard routes

### Pages Status
- `src/pages/SignIn.tsx` - ✅ Connected to Supabase, routes by user type
- `src/pages/CustomerSignup.tsx` - ✅ Connected to Supabase  
- `src/pages/BusinessSignup.tsx` - ✅ Connected to Supabase with membership tiers
- `src/pages/CustomerDashboard.tsx` - ✅ UI complete, needs data integration
- `src/pages/BusinessDashboard.tsx` - ✅ UI complete, needs data integration
- `src/pages/AdminDashboard.tsx` - ✅ UI complete for Jim & owners
- `src/pages/Contact.tsx` - ⚠️ Static form, needs backend
- All other pages - ✅ Complete UI/styling

### Components
- `src/components/Header.tsx` - ✅ Shows auth state, user menu
- `src/components/AnimatedButton.tsx` - ✅ Complete
- `src/components/AnimatedCard.tsx` - ✅ Complete
- `src/components/Footer.tsx` - ✅ Complete

## 🔧 Development Environment

### Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing Authentication
1. Go to http://localhost:5173/customer-signup
2. Fill form and submit
3. Check Supabase dashboard → Authentication → Users
4. Sign in at http://localhost:5173/signin
5. Verify header shows user menu

## 🚨 Known Issues & Notes

### Working Features
- Customer signup with email verification
- Sign in with session persistence
- Password validation and error handling
- Responsive design on all pages
- Loading states and animations

### Build Notes
- Use `--cache /tmp/.npm` flag for npm installs (permission fix)
- TypeScript strict mode enabled
- All animations performance optimized

## 📝 Business Logic Context

### MyDuckRewards Concept
- Physical claw machines at Leo's Coney Island locations
- Every play wins a collectible duck
- Ducks contain instant rewards + local business discounts
- Business membership tiers: Basic, Trade, Custom
- "Duck Alerts" for targeted marketing

### User Types
1. **Customers** - Play games, collect ducks, redeem rewards
2. **Businesses** - Pay for duck placement, send alerts
3. **Admins** - Manage system, locations, inventory

## 🎯 Immediate Next Steps

When continuing development, prioritize:

1. **Business Signup Integration**
   - Update `src/pages/BusinessSignup.tsx`
   - Add business creation logic
   - Handle membership tier selection

2. **Dashboard Creation**  
   - Create customer dashboard route
   - Create business dashboard route
   - Add dashboard navigation

3. **Contact Form Backend**
   - Connect to email service or Supabase
   - Add form submission handling

This documentation ensures any future Claude session can immediately understand the project state and continue development efficiently.