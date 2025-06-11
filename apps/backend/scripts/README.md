# MediaHand Development Setup

## Database Setup

### 1. Run Database Schema Setup
Copy and run the contents of `setup-database.sql` in your Supabase SQL Editor to create all necessary tables, functions, and policies.

### 2. Add Sample Data
Copy and run the contents of `create-dev-accounts.sql` in your Supabase SQL Editor to populate the database with sample data.

### 3. Create Test Accounts
You can create test accounts through the registration form or directly in Supabase Auth:

**Developer Test Accounts:**
- Email: `dev@mediahand.com`
- Password: `password123`
- Role: `owner`
- Business Type: `photographer`

**Photographer Test Account:**
- Email: `photographer@test.com`  
- Password: `password123`
- Role: `owner`
- Business Type: `photographer`

**Client Test Account:**
- Email: `client@test.com`
- Password: `password123`
- Role: `client`
- Business Type: `photographer`

## Authentication System Analysis

### Current Issues Fixed:
1. ✅ **Language**: Changed from Hebrew to English error messages
2. ✅ **Dashboard**: Created missing dashboard page
3. ✅ **Session Management**: Improved cookie handling with refresh tokens
4. ✅ **Error Handling**: Added proper error logging and user-friendly messages
5. ✅ **Database Schema**: Complete schema with RLS policies

### Authentication Flow:
1. User registers through `/register` form
2. Supabase creates auth.users record
3. Trigger automatically creates public.users record
4. User confirms email (if required)
5. User logs in through `/login` form
6. Session cookies are set (access + refresh tokens)
7. User is redirected to `/dashboard`

### API Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password` - Password reset confirmation

### Session Management:
- Access token: 1 hour expiry
- Refresh token: 7 days expiry  
- Both stored in HTTP-only cookies
- RLS policies enforce data isolation

## Development Workflow

### Testing Authentication:
1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:4321`
3. Register a new account or use test accounts
4. Verify dashboard access after login
5. Test logout functionality

### Database Access:
- Supabase URL: `https://ceqapbmoaspmhshyfmkt.supabase.co`
- All data is isolated per user via RLS
- Use SQL Editor for direct database queries
- Check auth.users and public.users tables

### Debugging:
- Check browser console for errors
- Check browser Application tab for cookies
- Use Supabase logs for backend issues
- Check server logs for API errors

## Security Features

✅ **Row Level Security (RLS)** - Users can only access their own data
✅ **HTTP-only Cookies** - Secure session storage
✅ **Email Validation** - Proper email format checking
✅ **Password Validation** - Minimum 6 characters
✅ **CSRF Protection** - SameSite cookie policy
✅ **SQL Injection Prevention** - Parameterized queries

## Next Steps

1. Test all authentication flows
2. Verify dashboard functionality
3. Test sample data display
4. Implement additional pages (clients, projects, etc.)
5. Add middleware for protected routes
6. Implement refresh token logic 