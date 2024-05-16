import { Module } from '@nestjs/common';
import { SwitchesService } from './switches.service';
import { SwitchesController } from './switches.controller';

@Module({
  controllers: [SwitchesController],
  providers: [SwitchesService],
})
export class SwitchesModule {}
