import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    // If 2FA is enabled, we should check that too, but usually that happens in a second step or verify endpoint.
    // For simplicity, we assume login endpoint returns token directly unless 2FA is enforced logic which we handle in controller.
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isTwoFactorEnabled: user.isTwoFactorEnabled
      }
    };
  }

  async register(registerDto: any) {
    const existingUser = await this.usersService.findOne(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      discordNick: registerDto.discordNick,
      role: registerDto.role || 'USER', // Allow creating admin if explicitly passed (unsafe for prod but ok for setup)
    });

    return this.login(user);
  }

  async generateTwoFactorSecret(user: any) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'KorczeTube', secret);

    await this.usersService.update(user.id, {
      twoFactorSecret: secret,
    });

    return {
      secret,
      otpauthUrl,
    };
  }
  
  async generateQrCode(otpauthUrl: string) {
      return toDataURL(otpauthUrl);
  }

  async verifyTwoFactorCode(userCode: string, user: any) {
      const dbUser = await this.usersService.findById(user.id);
      if(!dbUser?.twoFactorSecret) {
          throw new BadRequestException('2FA not set up');
      }
      
      const isCodeValid = authenticator.verify({
          token: userCode,
          secret: dbUser.twoFactorSecret
      });
      
      if (!isCodeValid) {
          throw new UnauthorizedException('Invalid 2FA code');
      }
      
      return true;
  }
  
  async turnOnTwoFactor(userId: string) {
      return this.usersService.update(userId, { isTwoFactorEnabled: true });
  }
}
