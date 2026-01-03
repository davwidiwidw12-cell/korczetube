import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const adminEmail = 'korcze@korczetube.com';
    const exists = await this.prisma.user.findUnique({ where: { email: adminEmail } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash('korcze_admin_password', 10);
      await this.prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Korcze',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('Admin user seeded: korcze@korczetube.com / korcze_admin_password');
    }
  }

  getHello(): string {
    return 'KorczeTube API Running';
  }
}
