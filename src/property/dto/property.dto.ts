import { ActiveStatus } from 'src/common/enums/status.enum';

export class PropertyDto {
  id: number;
  name: string;
  address: string;
  description?: string;
  images?: string[];
  status: ActiveStatus;
  hostId?: number;
  createdAt: Date;
  updatedAt: Date;
}
