const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function test() {
  const user = await prisma.user.findUnique({ where: { email: 'fleet@transitops.in' }, include: { role: true } });
  console.log('User found:', !!user);
  if (user) {
    const valid = await bcrypt.compare('Transit123!', user.passwordHash);
    console.log('Password valid:', valid);
    console.log('User role:', user.role.name);
    console.log('Failed attempts:', user.failedLoginAttempts);
    console.log('Locked until:', user.lockedUntil);
  }
  await prisma.$disconnect();
}

test();