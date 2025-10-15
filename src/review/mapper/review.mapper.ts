import { ReviewEntity } from 'src/database/entities/review.entity';
import { ReviewResponseDto } from '../dto/review-response.dto';

export class ReviewMapper {
  static toResponseDto(review: ReviewEntity): ReviewResponseDto {
    return {
      id: review.id,
      comment: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      user: {
        id: review.user.id,
        username: review.user.username,
      },
      property: {
        id: review.property.id,
        name: review.property.name,
      },
    };
  }
}
