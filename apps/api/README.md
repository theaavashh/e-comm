# Gharsamma E-commerce API

A robust, production-ready Express.js API built with TypeScript, Prisma ORM, and comprehensive security middleware.

## 🚀 Features

- **MVC Architecture**: Clean separation of concerns with Models, Controllers, and Routes
- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Zod Validation**: Runtime type validation for request data
- **Security**: Comprehensive security middleware including:
  - Helmet for security headers
  - CORS protection
  - Rate limiting
  - Request sanitization
  - JWT authentication
  - Password hashing with bcrypt
- **Error Handling**: Centralized error handling with proper logging
- **Logging**: Winston-based logging with different levels
- **Database**: PostgreSQL with Prisma migrations

## 🛠️ Tech Stack

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting, JWT
- **Logging**: Winston
- **Package Manager**: pnpm

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Prisma client setup
│   ├── env.ts        # Environment validation
│   └── seed.ts       # Database seeding
├── controllers/      # Route controllers
│   ├── userController.ts
│   └── productController.ts
├── middleware/       # Express middleware
│   ├── auth.ts       # Authentication & authorization
│   ├── errorHandler.ts
│   ├── security.ts   # Security middleware
│   └── validation.ts # Request validation
├── routes/           # API routes
│   ├── auth.ts
│   └── products.ts
├── types/            # TypeScript type definitions
│   └── validation.ts # Zod schemas
├── utils/            # Utility functions
│   └── logger.ts     # Winston logger
└── index.ts          # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp env.example .env
```

3. Configure your `.env` file with your database URL and other settings.

4. Set up the database:
```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed the database with sample data
pnpm db:seed
```

5. Start the development server:
```bash
pnpm dev
```

The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile (protected)
- `PUT /api/v1/auth/profile` - Update user profile (protected)
- `PUT /api/v1/auth/change-password` - Change password (protected)
- `POST /api/v1/auth/logout` - Logout user (protected)

### Products
- `GET /api/v1/products` - Get all products (with pagination and filters)
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (Admin only)
- `PUT /api/v1/products/:id` - Update product (Admin only)
- `DELETE /api/v1/products/:id` - Delete product (Admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

The API includes a comprehensive e-commerce database schema with:

- **Users**: Customer and admin user management
- **Products**: Product catalog with variants and categories
- **Orders**: Order management with status tracking
- **Reviews**: Product reviews and ratings
- **Cart**: Shopping cart functionality
- **Addresses**: User shipping and billing addresses

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers for protection against common vulnerabilities
- **Input Validation**: Zod schemas for request validation
- **Password Hashing**: bcrypt for secure password storage
- **JWT**: Secure token-based authentication
- **Request Sanitization**: XSS protection

## 🧪 Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Health check
curl http://localhost:3001/health

# Register a new user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test123!"}'

# Get products
curl http://localhost:3001/api/v1/products
```

## 📝 Environment Variables

See `env.example` for all required environment variables including:

- Database connection
- JWT secrets
- Redis configuration
- Email settings
- Security settings

## 🚀 Deployment

The API is production-ready with:

- Environment-based configuration
- Proper error handling
- Security middleware
- Logging
- Graceful shutdown handling

## 📄 License

This project is part of the Gharsamma E-commerce platform.








