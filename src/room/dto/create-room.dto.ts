import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoomStatus } from '../../common/enums/status.enum';

export class CreateRoomDto {
  @IsString()
  type: string;

  @IsNumber()
  price: number;

  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsString()
  features?: string;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @IsOptional()
  images?: string[];

  @IsNumber()
  propertyId: string;
}
