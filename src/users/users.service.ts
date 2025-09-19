import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity as User } from '../database/entities/user.entity';
import { RoleEntity } from 'src/database/entities/user-role.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import bcrypt from 'node_modules/bcryptjs';
import { BCRYPT_SALT_ROUNDS } from 'src/common/constants/auth.constants';
import { FilterUserDto } from './dto/filter-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { AdminUserDto } from './dto/user-dto';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { ActiveStatus } from 'src/common/enums/status.enum';
import { plainToInstance } from 'class-transformer';
import { UserInfo } from 'src/database/entities/user-info.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserInfo)
    private infoRepository: Repository<UserInfo>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'password', 'status'],
      relations: ['roles'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'info'],
    });
  }

  async findAll(filters: FilterUserDto): Promise<AdminUserDto[]> {
    const query: FindOptionsWhere<User> = {};

    if (filters.email) {
      query.email = ILike(`%${filters.email}%`);
    }
    if (filters.username) {
      query.username = ILike(`%${filters.username}%`);
    }

    const pageSize = filters.pageSize ?? 3;
    const page = filters.page ?? 1;

    const users = await this.userRepository.find({
      where: query,
      relations: ['roles', 'info'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return users.map((user) => UserMapper.toAdminUserDto(user));
  }

  async create(createUserDto: CreateUserDto, adminId?: number): Promise<User> {
    const { info, ...userData } = createUserDto;

    const customerRole = await this.roleRepository.findOne({
      where: { role: Role.CUSTOMER },
    });
    if (!customerRole) {
      throw new InternalServerErrorException(ErrorMessage.ROLE_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_SALT_ROUNDS,
    );

    const newUser = {
      ...userData,
      roles: [customerRole],
      password: hashedPassword,
      status: ActiveStatus.ACTIVE,
      createdBy: adminId,
      info: info ? this.infoRepository.create(info) : undefined,
    };
    return await this.userRepository.save(newUser);
  }

  async update(id: number, adminId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['info', 'roles'],
    });
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        BCRYPT_SALT_ROUNDS,
      );
    }

    const { roles: roleNames, info, ...otherFields } = updateUserDto;
    Object.assign(user, otherFields);

    if (info) {
      user.info = plainToInstance(UserInfo, { ...user.info, ...info });
    }

    if (roleNames && roleNames.length) {
      const roles: RoleEntity[] = [];
      for (const roleName of roleNames) {
        const role = await this.roleRepository.findOne({
          where: { role: roleName },
        });
        if (!role) throw new NotFoundException(ErrorMessage.ROLE_NOT_FOUND);
        roles.push(role);
      }
      user.roles = roles;
    }

    user.updatedBy = adminId;
    return await this.userRepository.save(user);
  }

  async updateStatus(id: number, status: ActiveStatus, adminId: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    user.status = status;
    user.updatedBy = adminId;
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  async softRemove(id: number, adminId: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    user.status = ActiveStatus.INACTIVE;
    user.updatedBy = adminId;
    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }

  async updateLastLogin(userId: number) {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }
}
