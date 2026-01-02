
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const config = await prisma.systemConfig.findUnique({
        where: { key: 'navigation_menu' }
    });
    console.log(JSON.stringify(config?.value, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
