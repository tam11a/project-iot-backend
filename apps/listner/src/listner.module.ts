import { Module } from '@nestjs/common';
import { ListnerController } from './listner.controller';
import { ListnerService } from './listner.service';

@Module({
  imports: [],
  controllers: [ListnerController],
  providers: [ListnerService],
})
export class ListnerModule {}
