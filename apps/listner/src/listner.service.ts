import { Injectable } from '@nestjs/common';

@Injectable()
export class ListnerService {
  getHello(): string {
    return 'Hello World!';
  }
}
