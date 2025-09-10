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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { FilterUserDto } from './dto/filter-user.dto';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { AdminUserDto, UserDto } from './dto/user-dto';
import { UserMapper } from './mappers/user.mapper';

@Auth(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@User('sub') adminId: number, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, adminId);
  }

  @Get()
  async findAll(@Query() filters: FilterUserDto): Promise<AdminUserDto[]> {
    const users = this.usersService.findAll(filters);
    if (!(await users).length) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
    return users;
  }

  @Get(':id')
  @Auth()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User('sub') userId: number,
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

  @Patch(':id')
  @Auth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @User('sub') userId: number,
    @User('roles') roles: Role[],
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto | AdminUserDto> {
    if (!roles.includes(Role.ADMIN) && id !== userId) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_PROFILE);
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

  @Delete(':id/restore')
  restore(@User('sub') adminId: number, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.restore(id, adminId);
  }

  @Delete(':id/softDelete')
  softRemove(
    @User('sub') adminId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.softRemove(id, adminId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
