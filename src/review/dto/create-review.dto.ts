import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
  @IsString()
  propertyId: string;
}
