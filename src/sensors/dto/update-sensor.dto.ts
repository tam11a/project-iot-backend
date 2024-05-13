import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSensorDto } from './create-sensor.dto';

export class UpdateSensorDto extends PartialType(CreateSensorDto) {
  @ApiProperty()
  label: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  room_id: number;
}
