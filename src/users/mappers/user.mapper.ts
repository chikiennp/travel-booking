import { UserEntity as User } from 'src/database/entities/user.entity';
import { AdminUserDto, UserDto } from '../dto/user-dto';
import { RoleEntity } from 'src/database/entities/user-role.entity';

export class UserMapper {
  private static mapRoles(roles: RoleEntity[]): string[] {
    return roles?.map((role) => role.role) || [];
  }

  static toUserDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: this.mapRoles(user.roles),
    };
  }

  static toAdminUserDto(user: User): AdminUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: this.mapRoles(user.roles),
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
      lastLogin: user.lastLogin,
    };
  }
}
