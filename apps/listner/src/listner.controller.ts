import { Controller, Get } from '@nestjs/common';
import { ListnerService } from './listner.service';

@Controller()
export class ListnerController {
  constructor(private readonly listnerService: ListnerService) {}

  @Get()
  getHello(): string {
    return this.listnerService.getHello();
  }
}
