import { IsOptional, IsString } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  description?: string;
}
