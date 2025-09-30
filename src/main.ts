import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AuthGuard } from './common/guards/auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(app.get(AuthGuard));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  const timezone = configService.get<string>('TZ');
  if (timezone) {
    process.env.TZ = timezone;
  }
  await app.listen(port);
}
void bootstrap();
