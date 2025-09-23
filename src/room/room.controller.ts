import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfigFactory } from 'src/config/multer.config';
import { UploadType } from 'src/common/enums/multer.enum';
import { User } from 'src/common/decorators/user.decorator';
import { mapRoomToDto } from './mapper/room.mapper';
import { RoomStatus } from 'src/common/enums/status.enum';

@Auth(Role.HOST)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.ROOM)),
  )
  @Post()
  async create(
    @Body() dto: CreateRoomDto,
    @User('sub') hostId: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const room = await this.roomService.create(dto, hostId, files);
    return mapRoomToDto(room);
  }

  @Get('property/:propertyId')
  async findAll(
    @User('sub') hostId: string,
    @Param('propertyId') propertyId: string,
  ) {
    const rooms = await this.roomService.findAll(propertyId, hostId);
    return rooms.map(mapRoomToDto);
  }

  @Get('type/:roomTypeId')
  async findAllByType(
    @User('sub') hostId: string,
    @Param('roomTypeId') roomTypeId: string,
  ) {
    const rooms = await this.roomService.findAllByRoomType(roomTypeId, hostId);
    return rooms.map(mapRoomToDto);
  }

  @Get(':id')
  async findOne(@User('sub') hostId: string, @Param('id') id: string) {
    const room = await this.roomService.findOne(id, hostId);
    return mapRoomToDto(room);
  }

  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.ROOM)),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User('sub') hostId: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const room = await this.roomService.update(
      id,
      hostId,
      updateRoomDto,
      files,
    );
    return mapRoomToDto(room);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: RoomStatus,
    @Body('hostId') hostId: string,
  ) {
    const room = await this.roomService.updateStatus(id, hostId, status);
    return mapRoomToDto(room);
  }

  @Delete(':id/soft')
  async softDelete(@Param('id') id: string, @User('sub') hostId: string) {
    return this.roomService.softRemove(id, hostId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User('sub') hostId: string) {
    return this.roomService.remove(id, hostId);
  }
}
