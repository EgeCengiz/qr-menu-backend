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
        durationSeconds: 3,
      });
      media = await this.welcomeRepo.save(media);
    }
    // Ensure duration is set to 3 seconds as requested
    let needsSave = false;
    if (media.durationSeconds !== 3) {
      media.durationSeconds = 3;
      needsSave = true;
    }
    // Clean up hardcoded localhost or local IP URLs stored previously
    if (media.videoUrl && media.videoUrl.includes('/uploads/') && media.videoUrl.startsWith('http')) {
      media.videoUrl = media.videoUrl.substring(media.videoUrl.indexOf('/uploads/'));
      needsSave = true;
    }
    if (media.posterImg && media.posterImg.includes('/uploads/') && media.posterImg.startsWith('http')) {
      media.posterImg = media.posterImg.substring(media.posterImg.indexOf('/uploads/'));
      needsSave = true;
    }
    if (needsSave) {
      await this.welcomeRepo.save(media);
    }
    return media;
  }

  async updateWelcome(dto: UpdateWelcomeDto): Promise<WelcomeMediaEntity> {
    let media = await this.welcomeRepo.findOne({ where: { id: 1 } });
    if (!media) {
      media = this.welcomeRepo.create({ id: 1 });
    }
    // Clean up hardcoded localhost domains before saving
    if (dto.videoUrl && dto.videoUrl.includes('/uploads/')) {
      dto.videoUrl = dto.videoUrl.substring(dto.videoUrl.indexOf('/uploads/'));
    }
    if (dto.posterImg && dto.posterImg.includes('/uploads/')) {
      dto.posterImg = dto.posterImg.substring(dto.posterImg.indexOf('/uploads/'));
    }
    Object.assign(media, dto);
    return this.welcomeRepo.save(media);
  }
}
