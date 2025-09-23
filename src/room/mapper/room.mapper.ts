import { plainToInstance } from 'class-transformer';
import { RoomEntity } from 'src/database/entities/room.entity';
import { RoomType } from 'src/database/entities/room-type.entity';
import { RoomDto } from '../dto/room.dto';
import { RoomTypeDto } from '../dto/room-type.dto';

export const mapRoomToDto = (room: RoomEntity): RoomDto => {
  return plainToInstance(
    RoomDto,
    {
      id: room.id,
      roomNumber: room.roomNumber,
      price: room.price,
      beds: room.beds,
      features: room.features,
      status: room.status,
      images: room.images,
      roomTypeId: room.roomType?.id,
      roomTypeName: room.roomType?.name,
      propertyId: room.property?.id,
      propertyName: room.property?.name,
    },
    { excludeExtraneousValues: true },
  );
};

export const mapRoomTypeToDto = (roomType: RoomType): RoomTypeDto => {
  return plainToInstance(
    RoomTypeDto,
    {
      id: roomType.id,
      name: roomType.name,
      capacity: roomType.capacity,
      description: roomType.description,
      beds: roomType.beds,
      images: roomType.images,
      propertyId: roomType.property?.id,
      propertyName: roomType.property?.name,
    },
    { excludeExtraneousValues: true },
  );
};
