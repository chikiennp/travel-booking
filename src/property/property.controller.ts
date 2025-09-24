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
  Query,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadType } from 'src/common/enums/multer.enum';
import { multerConfigFactory } from 'src/config/multer.config';
import { FilterPropertyDto } from './dto/filter-property.dto';
import { PropertyDto } from './dto/property.dto';
import { ActiveStatus } from 'src/common/enums/status.enum';

@Auth(Role.HOST)
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.PROPERTY)),
  )
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @User('sub') hostId: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.propertyService.create(hostId, createPropertyDto, files);
  }

  @Get()
  async findAllForHost(
    @Query() filters: FilterPropertyDto,
    @User('sub') hostId: string,
  ): Promise<PropertyDto[]> {
    return this.propertyService.findAll(filters, hostId);
  }

  @Auth(Role.ADMIN)
  @Get('admin')
  async findAll(@Query() filters: FilterPropertyDto): Promise<PropertyDto[]> {
    return this.propertyService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfigFactory(UploadType.PROPERTY)),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @User('sub') hostId: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.propertyService.update(id, hostId, updatePropertyDto, files);
  }

  @Auth(Role.ADMIN)
  @Patch(':id/activate')
  activate(@Param('id') id: string, @User('sub') adminId: string) {
    return this.propertyService.updateStatus(id, ActiveStatus.ACTIVE, adminId);
  }

  @Auth(Role.ADMIN)
  @Patch(':id/disable')
  disable(@Param('id') id: string, @User('sub') adminId: string) {
    return this.propertyService.updateStatus(
      id,
      ActiveStatus.INACTIVE,
      adminId,
    );
  }

  @Auth(Role.ADMIN)
  @Delete(':id/softDelete')
  softRemove(@User('sub') adminId: string, @Param('id') id: string) {
    return this.propertyService.softRemove(id, adminId);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
