import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @HttpCode(HttpStatus.CREATED)
  @Auth(Role.CUSTOMER)
  @Post()
  create(
    @User('sub') userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(userId, createReviewDto);
  }

  @Public()
  @Get('property/:id')
  getReviewsByProperty(@Param('id') propertyId: string) {
    return this.reviewService.getReviewsByProperty(propertyId);
  }

  @Auth(Role.CUSTOMER)
  @Patch('property/:id')
  update(
    @User('sub') userId: string,
    @Param('id') propertyId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(userId, propertyId, updateReviewDto);
  }

  @HttpCode(HttpStatus.OK)
  @Auth(Role.CUSTOMER)
  @Delete(':id')
  remove(@User('sub') userId: string, @Param('id') id: string) {
    return this.reviewService.remove(userId, id);
  }
}
