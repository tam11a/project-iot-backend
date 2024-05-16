import { Controller, Get } from '@nestjs/common';
import { ListnerService } from './listner.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ListnerController {
  constructor(private readonly listnerService: ListnerService) {}

  @Get()
  getHello(): string {
    return this.listnerService.getHello();
  }

  @MessagePattern('temperature+humidity')
  async getTemperatureAndHumidity(data: any) {
    console.log('listner', data);
    return data;
  }
}
