import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/database/entities/room.entity';
import { RoomType } from 'src/database/entities/room-type.entity';
import { PropertyEntity } from 'src/database/entities/property.entity';
import { Repository } from 'typeorm';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { RoomStatus } from 'src/common/enums/status.enum';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepo: Repository<RoomEntity>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
    @InjectRepository(PropertyEntity)
    private readonly propertyRepo: Repository<PropertyEntity>,
  ) {}

  async create(
    dto: CreateRoomDto,
    hostId: string,
    files?: Express.Multer.File[],
  ) {
    const roomType = await this.roomTypeRepo.findOne({
      where: { id: dto.roomTypeId },
      relations: ['property', 'property.host'],
    });
    if (!roomType)
      throw new NotFoundException(ErrorMessage.ROOM_TYPE_NOT_FOUND);

    if (roomType.property.host.id !== hostId) {
      throw new ForbiddenException(ErrorMessage.ROOM_NOT_OWNED);
    }

    const beds = dto.beds
      ? { type: dto.beds.type, quantity: dto.beds.quantity }
      : {};

    const room = this.roomRepo.create({
      roomNumber: dto.roomNumber,
      price: dto.price,
      beds,
      features: dto.features,
      images: files?.map((f) => f.filename) || [],
      roomType,
      property: roomType.property,
      status: RoomStatus.AVAILABLE,
      createdBy: hostId,
    });
    return this.roomRepo.save(room);
  }

  async createMany(
    dtos: CreateRoomDto[],
    hostId: string,
    files?: Express.Multer.File[],
  ) {
    const roomsToCreate: RoomEntity[] = [];

    for (const dto of dtos) {
      const roomType = await this.roomTypeRepo.findOne({
        where: { id: dto.roomTypeId },
        relations: ['property', 'property.host'],
      });

      if (!roomType) {
        throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);
      }

      if (roomType.property.host.id !== hostId) {
        throw new ForbiddenException(ErrorMessage.ROOM_NOT_OWNED);
      }

      const beds = dto.beds
        ? { type: dto.beds.type, quantity: dto.beds.quantity }
        : {};

      const room = this.roomRepo.create({
        roomNumber: dto.roomNumber,
        price: dto.price,
        beds,
        features: dto.features,
        images: files?.map((f) => f.filename) || [],
        roomType,
        property: roomType.property,
        status: RoomStatus.AVAILABLE,
        createdBy: hostId,
      });
      roomsToCreate.push(room);
    }

    return this.roomRepo.save(roomsToCreate);
  }

  async findAll(propertyId: string, hostId: string) {
    const rooms = await this.roomRepo.find({
      where: {
        property: { id: propertyId, host: { id: hostId } },
      },
      relations: ['roomType', 'property', 'property.host'],
    });

    if (!rooms.length) throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);
    return rooms;
  }

  async findOne(roomId: string, hostId: string) {
    const room = await this.roomRepo.findOne({
      where: {
        id: roomId,
        property: { host: { id: hostId } },
      },
      relations: ['roomType', 'property', 'property.host'],
    });

    if (!room) throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);
    return room;
  }

  async findAllByRoomType(roomTypeId: string, hostId: string) {
    const rooms = await this.roomRepo.find({
      where: {
        roomType: { id: roomTypeId, property: { host: { id: hostId } } },
      },
      relations: ['roomType', 'property', 'property.host'],
      order: { roomNumber: 'ASC' },
    });

    return rooms;
  }

  async findAllByProperty(propertyId: string): Promise<RoomEntity[]> {
    const rooms = await this.roomRepo.find({
      where: {
        roomType: { property: { id: propertyId } },
      },
      relations: ['roomType', 'property', 'property.host'],
      order: { roomNumber: 'ASC' },
    });
    return rooms;
  }

  async update(
    id: string,
    hostId: string,
    dto: UpdateRoomDto,
    files?: Express.Multer.File[],
  ) {
    const room = await this.roomRepo.findOne({
      where: {
        id: id,
        property: { host: { id: hostId } },
      },
      relations: ['roomType', 'property', 'property.host'],
    });
    if (!room) throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);

    const images = files?.map((f) => f.filename);

    const newRoom = {
      ...room,
      ...dto,
      images: images ?? room.images,
      updatedBy: hostId,
    };

    return this.roomRepo.save(newRoom);
  }

  async updateStatus(id: string, hostId: string, status: RoomStatus) {
    const room = await this.roomRepo.findOne({
      where: {
        id,
        property: { host: { id: hostId } },
      },
      relations: ['property', 'property.host'],
    });
    if (!room) throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);

    room.status = status;
    room.updatedBy = hostId;
    room.updatedAt = new Date();
    return this.roomRepo.save(room);
  }

  async softRemove(id: string, hostId: string) {
    const room = await this.roomRepo.findOne({
      where: { id, property: { host: { id: hostId } } },
      relations: ['property', 'property.host'],
    });
    if (!room) throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);

    room.deletedAt = new Date();
    room.updatedBy = hostId;
    return this.roomRepo.save(room);
  }

  async remove(id: string, hostId: string) {
    const room = await this.roomRepo.findOne({
      where: {
        id: id,
        property: { host: { id: hostId } },
      },
      relations: ['roomType', 'property', 'property.host'],
    });
    if (!room) throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);

    return this.roomRepo.remove(room);
  }
}
