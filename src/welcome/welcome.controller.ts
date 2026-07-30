import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { WelcomeService, UpdateWelcomeDto } from './welcome.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('welcome')
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Get()
  getWelcome() {
    return this.welcomeService.getWelcome();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateWelcome(@Body() dto: UpdateWelcomeDto) {
    return this.welcomeService.updateWelcome(dto);
  }
}
