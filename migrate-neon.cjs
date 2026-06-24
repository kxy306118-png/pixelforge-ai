// Migration script - reads DATABASE_URL from .env.neon and runs SQL
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// Read the Neon DATABASE_URL from .env.neon
const envContent = fs.readFileSync('.env.neon', 'utf8');
const match = envContent.match(/DATABASE_URL="([^"]+)"/);
if (!match) {
  console.error('Could not find DATABASE_URL in .env.neon');
  process.exit(1);
}
const databaseUrl = match[1];
console.log('Connecting to:', databaseUrl.replace(/:[^:@]+@/, ':***@'));

const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } },
});

async function migrate() {
  try {
    console.log('1. Adding emailVerified column...');
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3)');
    console.log('   ✅ Done');

    console.log('2. Adding verifyToken column...');
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verifyToken" TEXT');
    console.log('   ✅ Done');

    console.log('3. Setting existing users as verified...');
    await prisma.$executeRawUnsafe('UPDATE "User" SET "emailVerified" = NOW() WHERE "emailVerified" IS NULL');
    console.log('   ✅ Done');

    const count = await prisma.user.count();
    console.log(`4. User count: ${count}`);

    const admins = await prisma.user.findMany({ where: { role: 'admin' }, select: { name: true, email: true, role: true, emailVerified: true } });
    console.log('5. Admin users:', JSON.stringify(admins, null, 2));

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
