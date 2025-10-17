import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomType } from 'src/database/entities/room-type.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { PropertyEntity } from 'src/database/entities/property.entity';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { RoomEntity } from 'src/database/entities/room.entity';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
    @InjectRepository(RoomEntity)
    private readonly roomRepo: Repository<RoomEntity>,
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
    return this.roomTypeRepo.save({
      ...dto,
      property,
      images,
      createdBy: hostId,
    });
  }

  async createManyTypes(
    hostId: string,
    index: number,
    dtos: CreateRoomTypeDto[],
    files?: Express.Multer.File[],
  ) {
    const results: RoomType[] = [];
    for (const dto of dtos) {
      const roomType = await this.create(hostId, index, dto, files);
      results.push(roomType);
    }

    return results;
  }

  async findAllByProperty(hostId: string, index: number) {
    const property = await this.findProperty(hostId, index);
    if (!property) throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);
    return property.roomTypes;
  }

  async findAllPublic(propertyId: string) {
    const property = await this.propertyRepo.findOne({
      where: { id: propertyId },
      relations: ['roomTypes', 'host'],
    });
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

    const images = files?.map((f) => f.filename);
    const roomType = property.roomTypes.find((rt) => rt.id === roomTypeId);
    if (!roomType) {
      throw new NotFoundException(ErrorMessage.ROOM_TYPE_NOT_FOUND);
    }

    return this.roomTypeRepo.save({
      ...roomType,
      ...dto,
      property,
      images: images ?? roomType.images,
      updatedBy: hostId,
    });
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
