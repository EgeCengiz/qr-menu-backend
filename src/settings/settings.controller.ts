import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsEntity } from '../entities/settings.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(): Promise<SettingsEntity> {
    return this.settingsService.getSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateSettings(@Body() dto: Partial<SettingsEntity>): Promise<SettingsEntity> {
    return this.settingsService.updateSettings(dto);
  }
}
