import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { SignInDto } from './sign-in.dto';
import { Type } from 'class-transformer';
import { CreateUserInfoDto } from 'src/users/dto/create-user-info.dto';

export class SignUpDto extends SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @ValidateNested()
  @Type(() => CreateUserInfoDto)
  @IsOptional()
  info: CreateUserInfoDto;
}
