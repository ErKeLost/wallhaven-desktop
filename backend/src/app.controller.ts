import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import https from 'https'; // Add this line to import the 'https' module

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('*')
  async getAll(@Req() req: Request): string {
    const targetUrl = `https://wallhaven.cc/api/v1${req.url}`;
    // return this.appService.getHello();
    console.log(targetUrl);
    const headers = {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua':
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    };
    const response = await axios.get(targetUrl, {
      headers,
      httpsAgent: new https.Agent({
        secureProtocol: 'TLSv1_2_method',
        rejectUnauthorized: false, // 注意：这会禁用证书验证，仅用于测试
      }),
    });
    console.log(response);

    return targetUrl;
  }
}
