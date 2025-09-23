import { Expose, Type } from 'class-transformer';

class BedDto {
  @Expose()
  type: string;

  @Expose()
  quantity: number;
}

export class RoomTypeDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  capacity: number;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => BedDto)
  beds?: { type: string; quantity: number }[];

  @Expose()
  images?: string[];

  @Expose()
  propertyId: number;

  @Expose()
  propertyName: string;
}
