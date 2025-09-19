import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from 'src/database/entities/property.entity';
import { UserEntity } from 'src/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyEntity, UserEntity])],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [TypeOrmModule, PropertyService],
})
export class PropertyModule {}
