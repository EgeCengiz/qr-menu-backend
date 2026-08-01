import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { WelcomeModule } from './welcome/welcome.module';
import { SeedModule } from './seed/seed.module';
import { CategoryEntity } from './entities/category.entity';
import { SubCategoryEntity } from './entities/sub-category.entity';
import { ProductEntity } from './entities/product.entity';
import { WelcomeMediaEntity } from './entities/welcome-media.entity';
import { SettingsEntity } from './entities/settings.entity';
import { SettingsModule } from './settings/settings.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'qrmenu'),
        entities: [CategoryEntity, SubCategoryEntity, ProductEntity, WelcomeMediaEntity, SettingsEntity],
        synchronize: true, // Automatically creates tables in MySQL
        logging: false,
        extra: {
          // Additional MySQL connection options if needed
        },
      }),
    }),
    AuthModule,
    CategoriesModule,
    WelcomeModule,
    SeedModule,
    SettingsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
