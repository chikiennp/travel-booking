import { User } from 'src/database/entities/user.entity';
import { AdminUserDto, UserDto } from '../dto/user-dto';

export class UserMapper {
  static toUserDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };
  }

  static toAdminUserDto(user: User): AdminUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
      lastLogin: user.lastLogin,
    };
  }
}
