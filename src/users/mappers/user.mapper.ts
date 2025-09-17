import { UserEntity as User } from 'src/database/entities/user.entity';
import { AdminUserDto, UserDto, UserInfoDto } from '../dto/user-dto';
import { RoleEntity } from 'src/database/entities/user-role.entity';
import { UserInfo } from 'src/database/entities/user-info.entity';

export class UserMapper {
  private static mapRoles(roles: RoleEntity[]): string[] {
    return roles?.map((role) => role.role) || [];
  }

  private static mapInfo(info: UserInfo): UserInfoDto {
    return {
      ...(info?.firstName && { firstName: info.firstName }),
      ...(info?.lastName && { lastName: info.lastName }),
      ...(info?.phone && { phone: info.phone }),
      ...(info?.address && { address: info.address }),
    };
  }

  static toUserDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: this.mapRoles(user.roles),
      info: this.mapInfo(user.info),
    };
  }

  static toAdminUserDto(user: User): AdminUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: this.mapRoles(user.roles),
      info: this.mapInfo(user.info),
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
      lastLogin: user.lastLogin,
    };
  }
}
