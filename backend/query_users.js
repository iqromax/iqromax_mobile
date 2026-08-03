const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ select: { id: true, customId: true, name: true, xp: true, status: true } });
  console.log(users);
}
main().catch(console.error).finally(() => prisma.$disconnect());
