const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.notification.deleteMany({
    where: {
      type: 'ADMIN'
    }
  });
  console.log('Deleted notifications:', result.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
