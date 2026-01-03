import { Controller, Post, UseGuards, Request, Body, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('2fa/generate')
  async generateTwoFactor(@Request() req: any) {
    const { otpauthUrl } = await this.authService.generateTwoFactorSecret(req.user);
    return this.authService.generateQrCode(otpauthUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/verify')
  async verifyTwoFactor(@Request() req: any, @Body('token') token: string) {
    const isCodeValid = await this.authService.verifyTwoFactorCode(token, req.user);
    if (!isCodeValid) {
        throw new UnauthorizedException('Invalid 2FA code');
    }
    await this.authService.turnOnTwoFactor(req.user.userId);
    return { success: true };
  }
}
