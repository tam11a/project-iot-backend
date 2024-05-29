import { Controller, Get, Query } from '@nestjs/common';
import { ChartService } from './chart.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Chart')
@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @ApiQuery({ name: 'sensor_id', required: false })
  @ApiQuery({ name: 'date_lte', type: 'datetime', required: false })
  @ApiQuery({ name: 'date_gte', type: 'datetime', required: false })
  @Get('temperature')
  getTemperatureData(
    @Query('sensor_id') sensor_id?: number,
    @Query('date_lte') date_lte?: string,
    @Query('date_gte') date_gte?: string,
  ) {
    return this.chartService.getTemperatureData(sensor_id, date_lte, date_gte);
  }
}
