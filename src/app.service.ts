import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'Cocktails API',
      version: '1.0.0',
      status: 'online',
      timestamp: new Date()
    };
  }
}
