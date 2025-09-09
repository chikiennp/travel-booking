import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import type { JwtPayloadInterface } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/common/decorators/user.decorator';
import type { Request } from 'express';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.register(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@User('sub') userId: number) {
    return await this.authService.signOut(userId);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@User('sub') userId: number, @Req() request: Request) {
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException();

    const [type, refreshToken] = authHeader.split(' ');
    if (type !== 'Bearer') throw new UnauthorizedException();

    return this.authService.refreshToken(userId, refreshToken);
  }

  @Get('profile')
  getProfile(@User() user: JwtPayloadInterface) {
    return user;
  }
}
