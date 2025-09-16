# Admin Dashboard Setup

This document provides instructions for setting up and using the admin authentication system.

## Prerequisites

1. Make sure the API server is running
2. Database is set up and migrated
3. Environment variables are configured

## Default Admin Credentials

- **Email**: `admin@gharsamma.com`
- **Password**: `admin123`

## Setup Instructions

### 1. Seed the Admin User

Run the following command to create the default admin user:

```bash
# From the API directory
cd apps/api
npm run db:seed-admin
```

Or use the shell script:

```bash
# From the project root
./apps/api/scripts/run-seed-admin.sh
```

### 2. Start the Services

Start both the API and Admin applications:

```bash
# Terminal 1 - API Server
cd apps/api
npm run dev

# Terminal 2 - Admin Dashboard
cd apps/admin
npm run dev
```

### 3. Access the Admin Dashboard

1. Open your browser and navigate to `http://localhost:3000` (or the admin app port)
2. Use the default credentials to log in:
   - Email: `admin@gharsamma.com`
   - Password: `admin123`
3. You'll be redirected to the dashboard upon successful login

## Features

### Authentication
- JWT-based authentication
- Protected routes
- Automatic token validation
- Secure logout functionality

### Admin Routes
- `POST /api/v1/auth/admin/login` - Admin login
- `POST /api/v1/auth/admin/forgot-password` - Password reset
- `GET /api/v1/auth/admin/profile` - Get admin profile
- `POST /api/v1/auth/admin/logout` - Admin logout

### Dashboard Features
- Responsive design
- Sidebar navigation
- Protected route access
- User profile display
- Real-time authentication state

## Security Features

- Password hashing with bcrypt
- JWT token expiration (24 hours)
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS protection

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gharsamma_ecommerce"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# API
PORT=3001
NODE_ENV=development

# Admin App
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Troubleshooting

### Common Issues

1. **Login fails with "Invalid credentials"**
   - Ensure the admin user has been seeded
   - Check if the email and password are correct
   - Verify the database connection

2. **Token validation errors**
   - Check if JWT_SECRET is set correctly
   - Ensure the token hasn't expired
   - Clear localStorage and try logging in again

3. **API connection errors**
   - Verify the API server is running
   - Check the NEXT_PUBLIC_API_URL environment variable
   - Ensure CORS is configured correctly

### Reset Admin Password

To reset the admin password, you can either:

1. **Update the seed script** and run it again
2. **Manually update the database**:
   ```sql
   UPDATE users 
   SET password = '$2a$12$hashedpassword' 
   WHERE email = 'admin@gharsamma.com';
   ```

## Development

### Adding New Admin Features

1. Create new routes in `apps/api/src/routes/admin.ts`
2. Use the `adminAuth` middleware for protected routes
3. Update the dashboard navigation in `apps/admin/src/app/dashboard/page.tsx`
4. Add new components as needed

### Customizing the UI

- Update styles in `apps/admin/src/app/globals.css`
- Modify components in `apps/admin/src/components/`
- Update the dashboard layout in `apps/admin/src/app/dashboard/page.tsx`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Enable HTTPS
4. Set up proper CORS origins
5. Use environment-specific database URLs
6. Consider implementing token refresh mechanism
7. Set up proper logging and monitoring

