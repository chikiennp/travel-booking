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

@Auth(Role.HOST)
@Controller('room-type')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.ROOM_TYPE)),
  )
  @Post('property/:propertyId')
  async create(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @User('sub') hostId: number,
    @Body() dto: CreateRoomTypeDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return await this.roomTypeService.create(hostId, propertyId, dto, files);
  }

  @Get('property/:propertyId')
  findAll(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @User('sub') hostId: number,
  ) {
    return this.roomTypeService.findAllByProperty(hostId, propertyId);
  }

  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.ROOM_TYPE)),
  )
  @Patch('property/:propertyId/:roomTypeId')
  update(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('roomTypeId', ParseIntPipe) roomTypeId: number,
    @Body() dto: UpdateRoomTypeDto,
    @User('sub') hostId: number,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.roomTypeService.update(
      hostId,
      propertyId,
      roomTypeId,
      dto,
      files,
    );
  }

  @Delete('property/:propertyId/:roomTypeId/soft')
  softDelete(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('roomTypeId', ParseIntPipe) roomTypeId: number,
    @User('sub') hostId: number,
  ) {
    return this.roomTypeService.softRemove(hostId, propertyId, roomTypeId);
  }

  @Delete('property/:propertyId/:roomTypeId')
  delete(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('roomTypeId', ParseIntPipe) roomTypeId: number,
    @User('sub') hostId: number,
  ) {
    return this.roomTypeService.remove(hostId, propertyId, roomTypeId);
  }
}
