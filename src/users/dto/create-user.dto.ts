import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CreateUserInfoDto } from './create-user-info.dto';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @Type(() => CreateUserInfoDto)
  info?: CreateUserInfoDto;

  @IsOptional()
  @IsArray()
  roleNames?: Role[];
}
