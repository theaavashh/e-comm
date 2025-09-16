import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin seed...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@gharsamma.com',
      },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@gharsamma.com',
        username: 'admin',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
      },
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('🎉 Admin seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin seed failed:', error);
      process.exit(1);
    });
}

export default seedAdmin;

