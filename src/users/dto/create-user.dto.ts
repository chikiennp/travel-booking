import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserInfoDto } from './create-user-info.dto';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Type(() => CreateUserInfoDto)
  info?: CreateUserInfoDto;
}
