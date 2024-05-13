import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SwitchesService } from './switches.service';
import { CreateSwitchDto } from './dto/create-switch.dto';
import { UpdateSwitchDto } from './dto/update-switch.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Switches')
@Controller('switches')
export class SwitchesController {
  constructor(private readonly switchesService: SwitchesService) {}

  @Post()
  create(@Body() createSwitchDto: CreateSwitchDto) {
    return this.switchesService.create(createSwitchDto);
  }

  @Get()
  findAll() {
    return this.switchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.switchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSwitchDto: UpdateSwitchDto) {
    return this.switchesService.update(+id, updateSwitchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.switchesService.remove(+id);
  }
}
