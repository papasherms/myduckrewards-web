# Claude Code Session Guide - MyDuckRewards

*This file contains detailed context for future Claude sessions to continue development seamlessly.*

## 📊 Current Project Status (December 2024)

### 🌐 Live Production Site
- **URL**: https://myduckrewards.com
- **Deployment**: AWS Amplify with GitHub CI/CD
- **Repository**: GitHub (private repo)
- **Domain**: Custom domain configured

### ✅ COMPLETED - Fully Working Features

#### Authentication System
- **Customer Registration**: Full signup flow with email verification
- **Business Registration**: Application workflow with admin approval
- **Admin Users**: Manual promotion from regular users
- **Password Reset**: Forgot password flow with email
- **Session Management**: Persistent login with Supabase Auth
- **User Routing**: Automatic routing based on user_type (customer/business/admin)

#### Dashboard System
- **Customer Dashboard** (`/dashboard/customer`)
  - Profile management with completion tracking
  - Duck collection display
  - Redemption history
  - Editable user information
  
- **Business Dashboard** (`/dashboard/business`)
  - Analytics overview
  - Duck Alert creation
  - Location management
  - Campaign tracking
  
- **Admin Dashboard** (`/dashboard/admin`)
  - User management with CRUD modals
  - Business approval/rejection workflow
  - Location management
  - System statistics
  - Admin profile editing

#### Business Approval Workflow
```typescript
// Business signup creates pending application
approval_status: 'pending'
is_active: false

// Admin approves → Business can login
approval_status: 'approved'
is_active: true
approved_at: timestamp
approved_by: admin_user_id

// Admin rejects → Business shown reason
approval_status: 'rejected'
rejection_reason: text
```

#### Dark/Light Mode
- **Implementation**: ThemeContext with localStorage
- **Toggle Location**: Header navigation
- **Coverage**: All components properly styled
- **Persistence**: Saves user preference

#### Profile Management
- **First-Time Flow**: Redirects to profile completion
- **Progress Tracking**: Shows completion percentage
- **Required Fields**: First name, last name, phone, address
- **Validation**: Form validation with error messages

#### Location System
- **Search**: By ZIP code or current location
- **Pre-fill**: Uses user's saved ZIP if available
- **Cards**: Interactive with Google Maps integration
- **Capacity**: Shows duck inventory per machine

#### Component Library
- **AnimatedButton**: Multiple variants (primary/secondary/outline)
- **AnimatedCard**: Scroll-triggered animations
- **AdminModals**: AddUserModal, AddBusinessModal, AddLocationModal
- **Header**: Auth-aware with user menu
- **Footer**: Links and social icons

### 🗄️ Database Structure (Supabase)

#### Current Setup Script
```sql
-- Use complete-database-setup.sql for fresh installs
-- Contains all tables, RLS policies, functions, triggers
```

#### Tables
1. **users** - Extended user profiles
2. **businesses** - Partnership applications and accounts
3. **locations** - Claw machine locations
4. **ducks** - Individual duck inventory
5. **user_ducks** - Collection tracking
6. **redemptions** - Reward redemption history
7. **duck_alerts** - Marketing campaigns

#### Key RLS Policies
- Users can only view/edit their own profile
- Anyone can submit business applications
- Only approved businesses can login
- Admins have full access to all tables
- Customers can view their own collections

#### Helper Functions
- `handle_new_user()` - Auto-creates profile on signup
- `approve_business()` - Admin approval function
- `reject_business()` - Admin rejection with reason
- `update_updated_at()` - Timestamp management

### ⚠️ PARTIALLY COMPLETE - Needs Work

#### Contact Form
- **Current**: Static form UI complete
- **Needed**: Email service integration (SendGrid/Resend)
- **Location**: `src/pages/Contact.tsx`

#### Locations Map
- **Current**: Location list with search
- **Needed**: Interactive map integration (Google Maps/Mapbox)
- **Location**: `src/pages/Locations.tsx`

#### Payment Processing
- **Current**: Membership tiers defined
- **Needed**: Stripe integration for subscriptions
- **Location**: Business signup flow

### 🔧 Development Environment

#### Required Environment Variables
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### Commands
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
```

#### Testing Locally
1. Create `.env` file with Supabase credentials
2. Run `npm install`
3. Run `npm run dev`
4. Create test accounts:
   - Customer: Normal signup
   - Business: Signup → Admin approval needed
   - Admin: Signup → Manually change user_type in database

### 🚨 Known Issues & Solutions

#### Issue: Business Signup RLS Error
**Error**: "new row violates row-level security policy"
**Solution**: Implemented approval workflow - businesses start as pending

#### Issue: Dark Mode Visibility
**Problem**: Some text/buttons not visible in certain modes
**Solution**: Added gradient backgrounds and proper contrast classes

#### Issue: SQL Script Errors
**Problem**: RAISE NOTICE not supported in Supabase
**Solution**: Created simplified scripts without RAISE statements

#### Issue: First-Time Login
**Problem**: Users with incomplete profiles
**Solution**: Added redirect to profile completion with progress tracking

### 📝 Implementation Notes

#### Authentication Flow
```typescript
// Customer signup
1. Fill form → supabase.auth.signUp()
2. Creates auth.users record
3. Trigger creates public.users profile
4. Email verification sent
5. First login → Check profile completion
6. Redirect to dashboard or profile page

// Business signup
1. Fill form → Create business application
2. Status = 'pending', is_active = false
3. Admin reviews in dashboard
4. Approval → Can login to business dashboard
5. Rejection → Shows reason, can reapply
```

#### User Type Routing
```typescript
// In SignIn.tsx
const userProfile = await getUserProfile(user.id)
switch(userProfile.user_type) {
  case 'customer': navigate('/dashboard/customer')
  case 'business': navigate('/dashboard/business')  
  case 'admin': navigate('/dashboard/admin')
}
```

#### Profile Completion
```typescript
// Check completion
const isProfileComplete = () => {
  return !!(first_name && last_name && phone && 
           street_address && city && state && zip_code)
}

// Calculate percentage
const getCompletionPercentage = () => {
  const fields = [first_name, last_name, email, phone, 
                  street_address, city, state, zip_code, date_of_birth]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}
```

### 🎨 UI/UX Standards

#### Form Input Styling
All form inputs (text, select, textarea) should use consistent styling:
```css
className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
```

For select elements, add `appearance-none` to remove browser default styling:
```css
className="... appearance-none"
```

#### Button Variants
- **Primary**: Orange gradient for main CTAs
- **Secondary**: Blue for navigation/secondary actions  
- **Outline**: Border-only for tertiary actions

### 🗺️ Google Maps Integration

The project uses Google Maps API for location display. To set up:

1. Get a Google Maps API key from Google Cloud Console
2. Enable Maps JavaScript API and Places API
3. Add to `.env` file:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 🎯 Recent Updates (December 2024)

1. **Email Templates Created**
   - Complete set of authentication email templates
   - Professional HTML design with responsive layout
   - Ready for Supabase Auth configuration
   - Templates include: signup confirmation, password reset, magic link, etc.

2. **Admin Client Implementation**
   - Service role key integration for RLS bypass
   - `supabase-admin.ts` with privileged operations
   - Admin dashboard updated to use service client
   - Fallback to regular client if service key unavailable

3. **Project Cleanup**
   - Removed duplicate `supabase-business.ts` file
   - Archived old SQL migration scripts
   - Updated README with current project status
   - All components verified as actively used

4. **Environment Configuration**
   - Added `VITE_SUPABASE_SERVICE_ROLE_KEY` to .env.example
   - Service role key now properly configured
   - Admin operations secured with service role

### 🎯 Immediate Next Steps

1. **Payment Integration**
   - Add Stripe for business subscriptions
   - Implement payment webhook handlers
   - Create subscription management UI

2. **Email Service**
   - Integrate SendGrid or Resend
   - Connect email templates to service
   - Test transactional emails

3. **Duck Management**
   - Create duck generation system
   - QR code scanning implementation
   - Redemption verification flow

4. **Duck Alerts**
   - Push notification setup
   - Email campaign integration
   - Target audience filtering

### 🚀 Deployment Notes

#### AWS Amplify Setup
- Connected to GitHub repository
- Auto-deploys on push to main branch
- Environment variables configured
- Custom domain connected

#### Build Settings
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
  cache:
    paths:
      - node_modules/**/*
```

### 📚 Key Files Reference

#### Core Configuration
- `src/lib/supabase.ts` - Supabase client setup
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/contexts/ThemeContext.tsx` - Dark mode management
- `src/types/auth.ts` - TypeScript interfaces

#### Main Pages
- `src/pages/SignIn.tsx` - Login with user type routing
- `src/pages/CustomerSignup.tsx` - Customer registration
- `src/pages/BusinessSignup.tsx` - Business application
- `src/pages/AdminDashboard.tsx` - Admin control panel
- `src/pages/ForgotPassword.tsx` - Password reset
- `src/pages/Locations.tsx` - Location finder

#### Components
- `src/components/AdminModals.tsx` - Admin CRUD dialogs
- `src/components/Header.tsx` - Navigation with auth
- `src/components/AnimatedButton.tsx` - Reusable button
- `src/components/AnimatedCard.tsx` - Animated container

#### Database
- `complete-database-setup.sql` - Full schema setup
- `check-database-health-simple.sql` - Health check script

### 🔒 Security Considerations

1. **RLS Policies**: All tables have Row Level Security
2. **User Isolation**: Users can only access their own data
3. **Admin Verification**: Manual promotion prevents abuse
4. **Business Approval**: Prevents spam registrations
5. **Environment Variables**: Never commit .env files

### 📈 Performance Optimizations

1. **Code Splitting**: React.lazy for dashboard routes
2. **Image Optimization**: WebP format where possible
3. **Bundle Size**: Tree shaking enabled
4. **Caching**: localStorage for theme preference
5. **Animations**: GPU-accelerated transforms

### 🐛 Debugging Tips

1. **Check Supabase Logs**: Dashboard → Logs → Recent queries
2. **RLS Testing**: Use Supabase SQL editor with auth context
3. **Network Tab**: Monitor API calls in browser DevTools
4. **Console Errors**: Check for unhandled promises
5. **Type Errors**: Run `npm run type-check`

---

This documentation ensures any future Claude session can immediately understand the project state and continue development efficiently. The project is production-ready with core features implemented and clear paths for remaining enhancements.