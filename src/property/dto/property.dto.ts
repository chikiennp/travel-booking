import { ActiveStatus } from 'src/common/enums/status.enum';

export class PropertyDto {
  id: string;
  name: string;
  address: string;
  description?: string;
  images?: string[];
  status: ActiveStatus;
  hostId?: string;
  createdAt: Date;
  updatedAt: Date;
}
