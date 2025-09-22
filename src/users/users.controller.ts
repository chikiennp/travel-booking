import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  ForbiddenException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { FilterUserDto } from './dto/filter-user.dto';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { AdminUserDto, UserDto } from './dto/user-dto';
import { UserMapper } from './mappers/user.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfigFactory } from 'src/config/multer.config';
import { UploadType } from 'src/common/enums/multer.enum';
import { ActiveStatus } from 'src/common/enums/status.enum';

@Auth(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createByAdmin(
    @User('sub') adminId: string,
    @Body() createUserDto: CreateUserDto & { roleNames?: Role[] },
  ) {
    const { roleNames, ...userDto } = createUserDto;
    return this.usersService.createByAdmin(userDto, roleNames, adminId);
  }

  @Get()
  @Auth(Role.ADMIN)
  async findAll(@Query() filters: FilterUserDto): Promise<AdminUserDto[]> {
    const users = this.usersService.findAll(filters);
    if (!(await users).length) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
    return users;
  }

  @Get('me')
  @Auth()
  async getMe(
    @User('sub') userId: string,
    @User('roles') roles: Role[],
  ): Promise<UserDto | AdminUserDto> {
    return this.findOne(userId, userId, roles);
  }

  @Get(':id')
  @Auth()
  async findOne(
    @Param('id') id: string,
    @User('sub') userId: string,
    @User('roles') roles: Role[],
  ): Promise<UserDto | AdminUserDto> {
    if (!roles.includes(Role.ADMIN) && id !== userId) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_PROFILE);
    }

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    if (roles.includes(Role.ADMIN)) {
      return UserMapper.toAdminUserDto(user);
    }
    return UserMapper.toUserDto(user);
  }

  @Patch('me')
  @Auth()
  @UseInterceptors(
    FileInterceptor(UploadType.AVATAR, multerConfigFactory(UploadType.AVATAR)),
  )
  async updateMe(
    @User('sub') userId: string,
    @User('roles') roles: Role[],
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserDto | AdminUserDto> {
    return this.update(userId, userId, roles, updateUserDto, file);
  }

  @Patch(':id')
  @Auth()
  @UseInterceptors(
    FileInterceptor(UploadType.AVATAR, multerConfigFactory(UploadType.AVATAR)),
  )
  async update(
    @Param('id') id: string,
    @User('sub') userId: string,
    @User('roles') roles: Role[],
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserDto | AdminUserDto> {
    if (!roles.includes(Role.ADMIN) && id !== userId) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_PROFILE);
    }
    if (file) {
      updateUserDto.info = {
        ...updateUserDto.info,
        avatar: file.filename,
      };
    }
    const user = await this.usersService.update(id, userId, updateUserDto);
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    if (roles.includes(Role.ADMIN)) {
      return UserMapper.toAdminUserDto(user);
    }
    return UserMapper.toUserDto(user);
  }

  @Patch(':id/activate')
  activateUser(@Param('id') id: string, @User('sub') adminId: string) {
    return this.usersService.updateStatus(id, ActiveStatus.ACTIVE, adminId);
  }

  @Patch(':id/ban')
  banUser(@Param('id') id: string, @User('sub') adminId: string) {
    return this.usersService.updateStatus(id, ActiveStatus.INACTIVE, adminId);
  }

  @Delete(':id/softDelete')
  softRemove(@User('sub') adminId: string, @Param('id') id: string) {
    return this.usersService.softRemove(id, adminId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
