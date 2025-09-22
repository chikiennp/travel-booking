import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/database/entities/room.entity';
import { RoomType } from 'src/database/entities/room-type.entity';
import { RoomTypeController } from './room-type.controller';
import { RoomTypeService } from './room-type.service';
import { PropertyEntity } from 'src/database/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, RoomType, PropertyEntity])],
  controllers: [RoomController, RoomTypeController],
  providers: [RoomService, RoomTypeService],
})
export class RoomModule {}
