import { Expose, Type } from 'class-transformer';
import { RoomStatus } from '../../common/enums/status.enum';

class BedDto {
  @Expose()
  type: string;

  @Expose()
  quantity: number;
}

export class RoomDto {
  @Expose()
  id: string;

  @Expose()
  roomNumber: string;

  @Expose()
  price: number;

  @Expose()
  @Type(() => BedDto)
  beds?: BedDto;

  @Expose()
  features?: string;

  @Expose()
  status: RoomStatus;

  @Expose()
  images?: string[];

  @Expose()
  roomTypeId: string;

  @Expose()
  roomTypeName: string;

  @Expose()
  propertyId: string;

  @Expose()
  propertyName: string;
}
