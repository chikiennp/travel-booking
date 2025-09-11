/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        error: this.formatErrors(errors),
      });
    }
    return value;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.some((type) => metatype === type);
  }

  private formatErrors(errors: any[]): any[] {
    return errors.map((err) => ({
      field: err.property,
      errors: Object.values(err.constraints || {}),
      children:
        err.children && err.children.length > 0
          ? this.formatErrors(err.children)
          : [],
    }));
  }
}
