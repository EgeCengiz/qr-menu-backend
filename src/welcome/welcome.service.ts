import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WelcomeMediaEntity } from '../entities/welcome-media.entity';

export class UpdateWelcomeDto {
  videoUrl?: string | null;
  posterImg?: string;
  title?: string;
  subtitle?: string;
  durationSeconds?: number;
}

@Injectable()
export class WelcomeService {
  constructor(
    @InjectRepository(WelcomeMediaEntity)
    private readonly welcomeRepo: Repository<WelcomeMediaEntity>,
  ) {}

  async getWelcome(): Promise<WelcomeMediaEntity> {
    let media = await this.welcomeRepo.findOne({ where: { id: 1 } });
    if (!media) {
      // Create default if not present
      media = this.welcomeRepo.create({
        videoUrl: null,
        posterImg:
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800',
        title: 'HOOKAHLAB LOUNGE & CAFE',
        subtitle: 'PREMIUM QR MENU EXPERIENCE',
        durationSeconds: 4,
      });
      media = await this.welcomeRepo.save(media);
    }
    return media;
  }

  async updateWelcome(dto: UpdateWelcomeDto): Promise<WelcomeMediaEntity> {
    let media = await this.welcomeRepo.findOne({ where: { id: 1 } });
    if (!media) {
      media = this.welcomeRepo.create({ id: 1 });
    }
    Object.assign(media, dto);
    return this.welcomeRepo.save(media);
  }
}
