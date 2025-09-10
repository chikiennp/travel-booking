import { Role } from 'src/common/enums/role.enum';

export class UserDto {
  id: number;
  username: string;
  email: string;
  roles: Role[];
}

export class AdminUserDto extends UserDto {
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  lastLogin?: Date | null;
}
