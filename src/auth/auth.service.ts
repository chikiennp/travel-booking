import { SignUpDto } from './dto/sign-up.dto';
import { User } from 'src/common/decorators/user.decorator';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpCode,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'node_modules/bcryptjs';
import { REDIS_CLIENT } from 'src/common/constants/redis.constants';
import * as redis from 'redis';
import { SignInDto } from './dto/sign-in.dto';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { ActiveStatus } from 'src/common/enums/status.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT) private redisClient: redis.RedisClientType,
  ) {}

  async register(signUpDto: SignUpDto, file?: Express.Multer.File) {
    const user = await this.userService.findByUsername(signUpDto.username);
    if (user) {
      throw new ConflictException(ErrorMessage.USER_ALREADY_EXISTS);
    }

    if (signUpDto.password !== signUpDto.confirmPassword) {
      throw new BadRequestException(ErrorMessage.CONFIRM_PASSWORD_UNMATCHED);
    }

    const newUser = {
      email: signUpDto.email,
      username: signUpDto.username,
      password: signUpDto.password,
      info: {
        ...signUpDto.info,
        avatar: file?.filename ?? null,
      },
    };
    const { id, email, username, info } =
      await this.userService.create(newUser);

    const { phone, address, firstName, lastName } = info;
    return {
      id,
      email,
      username,
      phone,
      address,
      firstName,
      lastName,
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findByEmailOrUsername(
      signInDto.identifier,
    );
    if (!user || !user.password) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    if (user.status != ActiveStatus.ACTIVE) {
      throw new ForbiddenException(ErrorMessage.USER_INACTIVE);
    }

    const isMatch = await bcrypt.compare(signInDto.password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    await this.userService.updateLastLogin(user.id);

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles.map((r) => r.role),
    };
    //access token
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: Number(process.env.JWT_EXPIRES),
    });
    await this.redisClient.setEx(
      `auth:token:${user.id}`,
      Number(process.env.JWT_EXPIRES),
      token,
    );

    //refresh token
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: Number(process.env.JWT_REFRESH_EXPIRES),
      },
    );
    await this.redisClient.setEx(
      `auth:refresh:${user.id}`,
      Number(process.env.JWT_REFRESH_EXPIRES),
      refreshToken,
    );

    const { email, info } = user;
    const { phone, address, firstName, lastName } = info;
    return {
      accessToken: token,
      accessTokenExpiresIn: Number(process.env.JWT_EXPIRES),
      refreshToken: refreshToken,
      refreshTokenExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES),
      userInfo: {
        email,
        phone,
        address,
        firstName,
        lastName,
        avatar: user.info.avatar
          ? `${process.env.BASE_URL}/uploads/avatar/${user.info.avatar}`
          : null,
      },
    };
  }

  async forgotPassword(email: string) {
    return await this.userService.forgotPassword(email);
  }

  async resetPassword(token: string, password: string) {
    return await this.userService.resetPassword(token, password);
  }

  async activateAccount(token: string) {
    return await this.userService.activateAccount(token);
  }

  @HttpCode(204)
  async signOut(@User('sub') userId: string) {
    await this.redisClient.del(`auth:token:${userId}`);
    await this.redisClient.del(`auth:refresh:${userId}`);
    return { message: 'Successfully logged out' };
  }

  async refreshToken(@User('sub') userId: string, refreshToken: string) {
    const redisToken = await this.redisClient.get(`auth:refresh:${userId}`);
    if (!redisToken || redisToken !== refreshToken) {
      throw new UnauthorizedException(ErrorMessage.TOKEN_INVALID_OR_EXPIRED);
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    //access token
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: Number(process.env.JWT_EXPIRES),
    });
    await this.redisClient.setEx(
      `auth:token:${user.id}`,
      Number(process.env.JWT_EXPIRES),
      token,
    );
    return { access_token: token };
  }
}
