import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  MqttContext,
} from '@nestjs/microservices';

@ApiTags('Sensors')
@Controller('sensors')
export class SensorsController {
  constructor(
    private readonly sensorsService: SensorsService,
    @Inject('MQ_CLIENT') private client: ClientProxy,
  ) {
    client.connect();
  }

  @Post()
  create(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorsService.create(createSensorDto);
  }

  @Get()
  findAll() {
    return this.sensorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSensorDto: UpdateSensorDto) {
    return this.sensorsService.update(+id, updateSensorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorsService.remove(+id);
  }

  @MessagePattern('sensors/+/temperature/+')
  getTemperature(@Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
  }
}
