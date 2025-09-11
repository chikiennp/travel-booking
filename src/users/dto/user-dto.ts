export class UserDto {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export class AdminUserDto extends UserDto {
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  lastLogin?: Date | null;
}
