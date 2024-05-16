import { ApiProperty } from '@nestjs/swagger';

export class CreateSwitchDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  room_id: number;
}
