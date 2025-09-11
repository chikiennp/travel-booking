import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ActiveStatus } from 'src/common/enums/status.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(ActiveStatus)
  status?: ActiveStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
