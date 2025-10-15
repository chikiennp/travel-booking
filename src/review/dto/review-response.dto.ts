// src/review/dto/review-response.dto.ts
export class ReviewUserDto {
  id: string;
  username: string;
}

export class ReviewPropertyDto {
  id: string;
  name: string;
}

export class ReviewResponseDto {
  id: string;
  comment: string;
  rating: number;
  createdAt: Date;
  user: ReviewUserDto;
  property: ReviewPropertyDto;
}
