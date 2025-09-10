import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { RoleEntity } from 'src/database/entities/user-role.entity';
import { UserInfo } from 'src/database/entities/user-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, UserInfo])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
