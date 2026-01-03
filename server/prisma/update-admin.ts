import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const newEmail = 'korcze@tajnylogin.wwpp.com';
  const newPasswordRaw = 'ghfjaslkh123hjgfs';
  const newPasswordHash = await bcrypt.hash(newPasswordRaw, 10);

  // 1. Find existing admin or user with old email
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'korcze@korczetube.com' },
        { email: newEmail }
      ]
    }
  });

  if (existingUser) {
    // Update existing
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email: newEmail,
        password: newPasswordHash,
        role: 'ADMIN',
        name: 'Korcze'
      }
    });
    console.log('Updated admin:', updated.email);
  } else {
    // Create new
    const created = await prisma.user.create({
      data: {
        email: newEmail,
        password: newPasswordHash,
        name: 'Korcze',
        role: 'ADMIN'
      }
    });
    console.log('Created admin:', created.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
