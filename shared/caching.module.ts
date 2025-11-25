import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'config/config.module';
import { CacheService } from './services/cache.services';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(
              `redis://sample:${configService.get<string>(
                'REDIS_PASSWORD',
              )}@redis-14555.c10.us-east-1-3.ec2.cloud.redislabs.com:14555`,
            ),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CachingModule {}
