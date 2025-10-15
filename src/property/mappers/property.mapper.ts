import { PropertyEntity } from 'src/database/entities/property.entity';
import { PropertyDto } from '../dto/property.dto';

export class PropertyMapper {
  static toDto(property: PropertyEntity): PropertyDto {
    return {
      id: property.id,
      name: property.name,
      address: property.address,
      description: property.description,
      images: property.images,
      status: property.status,
      star: property.star,
      rating: property.rating,
      hostId: property.host?.id,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }

  static toDtos(properties: PropertyEntity[]): PropertyDto[] {
    return properties.map((p) => this.toDto(p));
  }
}
