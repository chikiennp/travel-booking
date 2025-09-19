import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyEntity } from 'src/database/entities/property.entity';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { ActiveStatus } from 'src/common/enums/status.enum';
import { FilterPropertyDto } from './dto/filter-property.dto';
import { PropertyMapper } from './mappers/property.mapper';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async create(
    hostId: number,
    createPropertyDto: CreatePropertyDto,
    files?: Express.Multer.File[],
  ) {
    const host = await this.userRepository.findOneBy({ id: hostId });
    if (!host) throw new NotFoundException('Host not found');

    const images = files?.map((f) => f.filename) || [];

    const property = {
      ...createPropertyDto,
      images,
      status: ActiveStatus.ACTIVE,
      createdBy: hostId,
      host,
    };
    return this.propertyRepo.save(property);
  }

  async findAll(filters: FilterPropertyDto, hostId?: number) {
    const query: FindOptionsWhere<PropertyEntity> = {
      ...(filters.name && { name: ILike(`%${filters.name}%`) }),
      ...(filters.address && { address: ILike(`%${filters.address}%`) }),
      ...(filters.status && { status: filters.status }),
      ...(hostId && { host: { id: hostId } as UserEntity }),
    };

    const pageSize = filters.pageSize ?? 3;
    const page = filters.page ?? 1;

    const properties = await this.propertyRepo.find({
      where: query,
      relations: ['host'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return PropertyMapper.toDtos(properties);
  }

  findOne(id: number) {
    return this.propertyRepo.findOneBy({ id });
  }

  async update(
    id: number,
    hostId: number,
    updatePropertyDto: UpdatePropertyDto,
    files?: Express.Multer.File[],
  ) {
    const property = await this.propertyRepo.findOne({
      where: { id, host: { id: hostId } },
      relations: ['host'],
    });
    if (!property) {
      throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);
    }

    const images = [
      ...(property.images || []),
      ...(files?.map((f) => f.filename) || []),
    ];

    Object.assign(property, updatePropertyDto);
    property.images = images;
    property.updatedBy = hostId;

    return this.propertyRepo.save(property);
  }

  async remove(id: number) {
    return this.propertyRepo.delete(id);
  }

  async softRemove(id: number, adminId: number) {
    const property = await this.propertyRepo.findOneBy({ id });
    if (!property) throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);

    property.status = ActiveStatus.INACTIVE;
    property.updatedBy = adminId;
    property.deletedAt = new Date();
    return this.propertyRepo.save(property);
  }

  async updateStatus(id: number, status: ActiveStatus, adminId: number) {
    const user = await this.propertyRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    user.status = status;
    user.updatedBy = adminId;
    return this.propertyRepo.save(user);
  }
}
