// src/users/dto/create-user-info.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserInfoDto } from './create-user-info.dto';

export class UpdateUserInfoDto extends PartialType(CreateUserInfoDto) {
  @IsOptional()
  @IsString()
  avatar?: string;
}
