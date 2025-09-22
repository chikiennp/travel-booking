import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomType } from 'src/database/entities/room-type.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { PropertyEntity } from 'src/database/entities/property.entity';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
    @InjectRepository(PropertyEntity)
    private readonly propertyRepo: Repository<PropertyEntity>,
  ) {}

  async create(
    hostId: string,
    index: number,
    dto: CreateRoomTypeDto,
    files?: Express.Multer.File[],
  ) {
    const property = await this.findProperty(hostId, index);
    if (!property) throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);

    const images = files?.map((f) => f.filename) || [];
    const roomType = this.roomTypeRepo.create({
      ...dto,
      property,
      images,
      createdBy: hostId,
    });

    return this.roomTypeRepo.save(roomType);
  }

  async findAllByProperty(hostId: string, index: number) {
    const property = await this.findProperty(hostId, index);
    if (!property) throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);

    return property.roomTypes;
  }

  async findProperty(hostId: string, index: number) {
    const property = await this.propertyRepo.find({
      where: { host: { id: hostId } },
      order: { id: 'ASC' },
      relations: ['roomTypes', 'host'],
    });

    if (!property.length) {
      throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);
    }

    const realIndex = index - 1;

    if (realIndex < 0 || realIndex >= property.length) {
      throw new NotFoundException(
        `Property index ${index} is out of range (total ${property.length})`,
      );
    }

    return property[realIndex];
  }

  async update(
    hostId: string,
    index: number,
    roomTypeId: string,
    dto: UpdateRoomTypeDto,
    files?: Express.Multer.File[],
  ) {
    const property = await this.findProperty(hostId, index);
    if (!property) throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);

    const images = files?.map((f) => f.filename) || [];

    const roomType = property.roomTypes.find((rt) => rt.id === roomTypeId);
    if (!roomType) {
      throw new NotFoundException(ErrorMessage.ROOM_TYPE_NOT_FOUND);
    }
    const newType = {
      ...roomType,
      ...dto,
      property,
      images,
      updatedBy: hostId,
    };
    return this.roomTypeRepo.save(newType);
  }

  async remove(hostId: string, propertyId: number, roomTypeId: string) {
    const property = await this.findProperty(hostId, propertyId);
    if (!property) throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);

    const roomType = property.roomTypes.find((rt) => rt.id === roomTypeId);
    if (!roomType) {
      throw new NotFoundException(ErrorMessage.ROOM_TYPE_NOT_FOUND);
    }
    return this.roomTypeRepo.remove(roomType);
  }

  async softRemove(hostId: string, propertyId: number, roomTypeId: string) {
    const property = await this.findProperty(hostId, propertyId);
    if (!property) throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);

    const roomType = property.roomTypes.find((rt) => rt.id === roomTypeId);
    if (!roomType) {
      throw new NotFoundException(ErrorMessage.ROOM_TYPE_NOT_FOUND);
    }

    return this.roomTypeRepo.softRemove(roomType);
  }
}
