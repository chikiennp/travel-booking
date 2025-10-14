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
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserInfo)
    private infoRepository: Repository<UserInfo>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
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

  async findByEmailOrUsername(identifier: string) {
    return this.userRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
      select: ['id', 'username', 'email', 'password', 'status'],
      relations: ['roles', 'info'],
    });
  }

  async findById(id: string): Promise<User | null> {
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

  async create(createUserDto: CreateUserDto, adminId?: string): Promise<User> {
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

  async createByAdmin(
    createUserDto: CreateUserDto,
    roleNames?: Role[],
    adminId?: string,
  ): Promise<User> {
    const { info, ...userData } = createUserDto;

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_SALT_ROUNDS,
    );

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      status: ActiveStatus.ACTIVE,
      createdBy: adminId,
      info: info ? this.infoRepository.create(info) : undefined,
    });

    if (roleNames && roleNames.length) {
      const roles: RoleEntity[] = [];
      for (const roleName of roleNames) {
        const role = await this.roleRepository.findOne({
          where: { role: roleName },
        });
        if (!role) throw new NotFoundException(ErrorMessage.ROLE_NOT_FOUND);
        roles.push(role);
      }
      newUser.roles = roles;
    } else {
      const customerRole = await this.roleRepository.findOne({
        where: { role: Role.CUSTOMER },
      });
      if (!customerRole) {
        throw new InternalServerErrorException(ErrorMessage.ROLE_NOT_FOUND);
      }
      newUser.roles = [customerRole];
    }

    return await this.userRepository.save(newUser);
  }

  async update(id: string, adminId: string, updateUserDto: UpdateUserDto) {
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

  async updateStatus(id: string, status: ActiveStatus, adminId: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    user.status = status;
    user.updatedBy = adminId;
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }

  async softRemove(id: string, adminId: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    user.status = ActiveStatus.INACTIVE;
    user.updatedBy = adminId;
    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }

  async updateLastLogin(userId: string) {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['info'],
    });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await this.userRepository.save(user);

    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const resetLink = `${clientUrl}/auth/forgot?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.info.firstName || ''},</p>
        <p>Click the link below to reset your password (valid for 15 minutes):</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
      `,
    });

    return { _id: user.id, email: user.email };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const user = await this.userRepository.findOneBy({ resetToken });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new NotFoundException(ErrorMessage.TOKEN_INVALID_OR_EXPIRED);
    }

    user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    return await this.userRepository.save(user);
  }
}
