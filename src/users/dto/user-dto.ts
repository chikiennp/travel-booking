export class UserInfoDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export class UserDto {
  id: string;
  username: string;
  email: string;
  roles: string[];
  info?: UserInfoDto;
}

export class AdminUserDto extends UserDto {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  lastLogin?: Date | null;
}
