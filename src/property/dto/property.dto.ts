import { ActiveStatus } from 'src/common/enums/status.enum';

export class PropertyDto {
  id: string;
  name: string;
  address: string;
  description?: string;
  images?: string[];
  star?: number;
  rating?: number;
  status: ActiveStatus;
  hostId?: string;
  createdAt: Date;
  updatedAt: Date;
}
