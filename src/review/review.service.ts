import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/database/entities/review.entity';
import { PropertyEntity } from 'src/database/entities/property.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { ReviewMapper } from './mapper/review.mapper';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async getReviewsByProperty(propertyId: string) {
    const reviews = await this.reviewRepo.find({
      where: { property: { id: propertyId } },
      relations: ['user', 'property'],
      order: { createdAt: 'DESC' },
    });
    return reviews.map((r) => ReviewMapper.toResponseDto(r));
  }

  async updatePropertyRating(propertyId: string) {
    const reviews = await this.getReviewsByProperty(propertyId);

    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

    await this.propertyRepo.update(propertyId, {
      rating: Number(avg.toFixed(1)),
    });
  }

  async create(userId: string, dto: CreateReviewDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);

    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
    });
    if (!property) throw new NotFoundException(ErrorMessage.PROP_NOT_FOUND);

    const review = await this.reviewRepo.save({
      comment: dto.comment,
      rating: dto.rating,
      user,
      property,
      createdBy: userId,
    });
    await this.updatePropertyRating(property.id);

    return ReviewMapper.toResponseDto(review);
  }

  async update(userId: string, propertyId: string, dto: UpdateReviewDto) {
    const review = await this.reviewRepo.findOne({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
      relations: ['property', 'user'],
    });
    if (!review) throw new NotFoundException(ErrorMessage.REVIEW_NOT_FOUND);
    if (review.user.id !== userId)
      throw new ForbiddenException(ErrorMessage.REVIEW_NOT_OWNED);

    Object.assign(review, dto, { updatedBy: userId });
    await this.reviewRepo.save(review);
    await this.updatePropertyRating(propertyId);

    return ReviewMapper.toResponseDto(review);
  }

  async remove(userId: string, reviewId: string) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['property', 'user'],
    });
    if (!review) throw new NotFoundException(ErrorMessage.REVIEW_NOT_FOUND);
    if (review.user.id !== userId)
      throw new ForbiddenException(ErrorMessage.REVIEW_NOT_OWNED);

    await this.reviewRepo.save({
      id: reviewId,
      deletedAt: new Date(),
      updatedBy: userId,
    });
    await this.updatePropertyRating(review.property.id);
  }
}
