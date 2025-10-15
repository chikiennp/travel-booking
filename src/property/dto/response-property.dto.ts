import { PropertyDto } from './property.dto';

export class PaginatedPropertyDto {
  total: number;
  page: number;
  pageSize: number;
  data: PropertyDto[];
}
