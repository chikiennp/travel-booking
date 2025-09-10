// src/users/dto/create-user-info.dto.ts
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class CreateUserInfoDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  preferences?: Record<string, unknown>;
}
