export class UserInfoDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export class UserDto {
  id: number;
  username: string;
  email: string;
  roles: string[];
  info?: UserInfoDto;
}

export class AdminUserDto extends UserDto {
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  lastLogin?: Date | null;
}
