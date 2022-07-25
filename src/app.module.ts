import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from '@/categories/categories.module';
import { PlacesModule } from '@/places/places.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      cache: false,
   }), 
   BullModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
        redis: {
            host: configService.get('queue.redis.host'),
            port: configService.get('queue.redis.post'),
        }
    }),
    inject: [ConfigService],
   }),
   MongooseModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      uri: configService.get('database.mongodb.host'),
      useNewUrlParser: true
     }),
     inject: [ConfigService],
   }),
   CategoriesModule,
   PlacesModule,
  ],
})
export class AppModule {}