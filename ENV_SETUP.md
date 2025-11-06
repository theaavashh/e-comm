# Environment Variables Setup

This project uses environment variables for configuration. **No hardcoded API URLs are allowed** in the codebase.

## Next.js Apps (Web & Admin)

Both Next.js applications (`apps/web` and `apps/admin`) require a `.env.local` file in their respective directories.

### Required Environment Variables

Create `.env.local` files:

**`apps/web/.env.local`**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4444
```

**`apps/admin/.env.local`**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4444
```

### Ports
- **Web (Frontend)**: `http://localhost:4000`
- **Admin**: `http://localhost:4001`
- **API**: `http://localhost:4444`

## API Server

The API server uses a `.env` file (not `.env.local`) in the `apps/api` directory.

### Setup

1. Copy `apps/api/env.example` to `apps/api/.env`:
   ```bash
   cp apps/api/env.example apps/api/.env
   ```

2. Update the `.env` file with your configuration:
   ```env
   PORT=4444
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   # ... other variables
   ```

## Important Notes

1. **Never commit `.env.local` files** - They are gitignored
2. **All API URLs must come from environment variables** - No hardcoded URLs in code
3. **Use `NEXT_PUBLIC_API_BASE_URL`** for Next.js apps (not `NEXT_PUBLIC_API_URL`)
4. **API uses `.env`** (server-side), Next.js uses `.env.local` (client-side)

## Development

To start all services:

```bash
# From root directory
pnpm dev
```

Or start individually:

```bash
# Web (port 4000)
cd apps/web && pnpm dev

# Admin (port 4001)
cd apps/admin && pnpm dev

# API (port 4444)
cd apps/api && pnpm dev
```

