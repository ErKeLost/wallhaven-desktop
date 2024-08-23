import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('*')
  async getAll(@Req() req: Request): string {
    const targetUrl = `https://wallhaven.cc/api/v1${req.url}`;
    // return this.appService.getHello();
    console.log(targetUrl)
    const response = await axios.get(targetUrl);
    console.log(response);

    return targetUrl;
  }
}
