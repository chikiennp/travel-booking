import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
