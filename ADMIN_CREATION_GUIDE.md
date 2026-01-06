# Admin User Creation - Gharsamma E-commerce

## ✅ Admin User Successfully Created

An admin user has been successfully created with the following credentials:

### 📋 Admin Credentials

- **Email**: `admin@gharsamma.com`
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `ADMIN`
- **ID**: `cmk2fnwz10000zr986ih44os3`
- **Status**: Active and Email Verified

## 🛠️ Available Admin Creation Scripts

### 1. Primary Admin Creation Script

**File**: `apps/api/src/scripts/seedAdmin.ts`
**Command**: `npm run db:seed-admin`

This script:

- ✅ Creates an admin user with predefined credentials
- ✅ Checks if admin already exists to prevent duplicates
- ✅ Hashes password with bcrypt (12 rounds)
- ✅ Sets user role as ADMIN
- ✅ Marks email as verified
- ✅ Provides detailed console output

### 2. Shell Script Wrapper

**File**: `apps/api/scripts/run-seed-admin.sh`
**Command**: `./scripts/run-seed-admin.sh`

This script:

- ✅ Validates .env file existence
- ✅ Runs the TypeScript admin seed script
- ✅ Provides user-friendly output

### 3. Admin Login Endpoint

**API**: `POST /api/v1/admin/login`

**Request Body**:

```json
{
  "email": "admin@gharsamma.com",
  "password": "admin123"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cmk2fnwz10000zr986ih44os3",
      "email": "admin@gharsamma.com",
      "username": "admin",
      "role": "ADMIN"
    },
    "token": "jwt_token_here"
  }
}
```

## 🔧 Admin Authentication System

### Role-Based Access Control

The system implements comprehensive role-based authentication:

- **ADMIN**: Full access to all admin features
- **CUSTOMER**: Standard customer access
- **VENDOR**: Vendor-specific access (future feature)

### Authentication Middleware

- **`adminAuth`**:专门用于admin routes的验证
- **`authenticateToken`**: General authentication for protected routes
- \*\*`authorize("ADMIN")`: Role-based authorization

### Protected Admin Routes

All admin routes are protected with:

```typescript
router.use(authenticateToken, authorize("ADMIN"));
```

## 📝 User Registration (Non-Admin)

**Endpoint**: `POST /api/v1/auth/register`

For regular customer registration, use the auth endpoint:

- Creates customers with `CUSTOMER` role
- Different validation schema
- Email verification process

## 🔒 Security Features

### Password Security

- ✅ Bcrypt hashing with 12 salt rounds
- ✅ Minimum 6 character password requirement
- ✅ Secure password verification

### Token-Based Authentication

- ✅ JWT tokens for session management
- ✅ Token refresh capability
- ✅ Secure logout implementation

### Input Validation

- ✅ Zod schema validation for all inputs
- ✅ Email format validation
- ✅ SQL injection prevention with Prisma ORM

## 🚀 How to Use Admin Access

### 1. Access Admin Panel

Navigate to your admin application URL and login with:

- Email: `admin@gharsamma.com`
- Password: `admin123`

### 2. API Access

Include the JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### 3. Admin Features Available

- 📊 Sales Analytics & Reporting
- 📦 Product Management (with multi-currency pricing)
- 🛒 Order Management & Processing
- 👥 Customer Management
- 💰 Billing & Financial Reports
- 🎨 Media & Content Management
- ⚙️ System Configuration

## 🔧 Manual Admin Creation (Alternative)

If you need to create additional admin users manually:

### Database Method

```sql
INSERT INTO users (
  id, email, username, password, first_name, last_name,
  role, is_active, email_verified, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'new-admin@example.com',
  'newadmin',
  'bcrypt_hashed_password',
  'Admin',
  'User',
  'ADMIN',
  true,
  true,
  NOW(),
  NOW()
);
```

### API Method

```javascript
// Create user via API (requires existing admin)
POST /api/v1/admin/create
{
  "email": "new-admin@example.com",
  "username": "newadmin",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "User"
}
```

## 📋 Important Notes

### ⚠️ Security Reminders

1. **Change Default Password**: Update `admin123` to a secure password
2. **Use HTTPS**: Ensure admin panel is served over HTTPS
3. **Regular Updates**: Keep JWT secrets and passwords updated
4. **Access Logs**: Monitor admin login attempts

### 🔄 Password Reset

The system includes forgot password functionality:

- **Endpoint**: `POST /api/v1/admin/forgot-password`
- **Email**: `admin@gharsamma.com` for admin account
- **Process**: Email-based password reset link

### 🎯 Next Steps

1. **Login**: Access admin panel with provided credentials
2. **Test**: Verify multi-currency pricing features
3. **Configure**: Set up currency rates and pricing
4. **Secure**: Update default password and configure security settings

---

## ✅ Summary

Your admin system is fully operational with:

- ✅ Default admin user created
- ✅ Secure authentication system
- ✅ Role-based access control
- ✅ Multi-currency pricing support
- ✅ Comprehensive API endpoints
- ✅ Security best practices implemented

Ready to start managing your e-commerce store with full multi-currency support! 🎉
