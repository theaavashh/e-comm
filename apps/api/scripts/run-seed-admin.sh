#!/bin/bash

# Script to seed admin user
echo "🌱 Seeding admin user..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one based on env.example"
    exit 1
fi

# Run the admin seed script
npm run db:seed-admin

echo "✅ Admin seed completed!"

