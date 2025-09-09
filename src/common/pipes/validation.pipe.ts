import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value) as object;
    const error = await validate(object);
    if (error.length > 0) {
      const messages = error.map((err) => {
        return {
          field: err.property,
          errors: Object.values(err.constraints || {}),
        };
      });
      throw new BadRequestException({
        message: 'Validation failed',
        error: messages,
      });
    }
    return value;
  }
  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.some((type) => metatype === type);
  }
}
