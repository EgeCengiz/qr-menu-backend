import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WelcomeController } from './welcome.controller';
import { WelcomeService } from './welcome.service';
import { WelcomeMediaEntity } from '../entities/welcome-media.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WelcomeMediaEntity]), AuthModule],
  controllers: [WelcomeController],
  providers: [WelcomeService],
})
export class WelcomeModule {}
