import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/database/entities/review.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { PropertyEntity } from 'src/database/entities/property.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, UserEntity, PropertyEntity]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
