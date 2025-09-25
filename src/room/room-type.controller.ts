import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadType } from 'src/common/enums/multer.enum';
import { multerConfigFactory } from 'src/config/multer.config';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { mapRoomTypeToDto } from './mapper/room.mapper';

@Auth(Role.HOST)
@Controller('room-type')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.ROOM_TYPE)),
  )
  @Post('property/:index')
  async create(
    @Param('index', ParseIntPipe) index: number,
    @User('sub') hostId: string,
    @Body() dto: CreateRoomTypeDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const roomType = await this.roomTypeService.create(
      hostId,
      index,
      dto,
      files,
    );
    return mapRoomTypeToDto(roomType);
  }

  // room-type.controller.ts
  @Post('property/:index/bulk')
  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.ROOM_TYPE)),
  )
  async createBulkWithRooms(
    @Body() dtos: CreateRoomTypeDto[],
    @User('sub') hostId: string,
    @Param('index', ParseIntPipe) index: number,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.roomTypeService.createManyTypes(hostId, index, dtos, files);
  }

  @Get('property/:index')
  async findAll(
    @Param('index', ParseIntPipe) index: number,
    @User('sub') hostId: string,
  ) {
    const roomTypes = await this.roomTypeService.findAllByProperty(
      hostId,
      index,
    );
    return roomTypes.map(mapRoomTypeToDto);
  }

  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.ROOM_TYPE)),
  )
  @Patch('property/:index/:roomTypeId')
  async update(
    @Param('index', ParseIntPipe) index: number,
    @Param('roomTypeId') roomTypeId: string,
    @Body() dto: UpdateRoomTypeDto,
    @User('sub') hostId: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const updatedRoomType = await this.roomTypeService.update(
      hostId,
      index,
      roomTypeId,
      dto,
      files,
    );
    return mapRoomTypeToDto(updatedRoomType);
  }

  @Delete('property/:index/:roomTypeId/soft')
  softDelete(
    @Param('index', ParseIntPipe) index: number,
    @Param('roomTypeId') roomTypeId: string,
    @User('sub') hostId: string,
  ) {
    return this.roomTypeService.softRemove(hostId, index, roomTypeId);
  }

  @Delete('property/:index/:roomTypeId')
  delete(
    @Param('index', ParseIntPipe) index: number,
    @Param('roomTypeId') roomTypeId: string,
    @User('sub') hostId: string,
  ) {
    return this.roomTypeService.remove(hostId, index, roomTypeId);
  }
}
