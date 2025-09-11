import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

import { REDIS_CLIENT } from 'src/common/constants/redis.constants';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        const port = Number(configService.get('REDIS_PORT'));

        const client = createClient({
          socket: {
            host,
            port,
          },
        });

        client.on('error', (err: Error) => {
          console.error('Redis error:', err.message);
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
