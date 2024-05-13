import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  room_id: number;
}
