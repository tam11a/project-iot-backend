import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSwitchDto } from './create-switch.dto';

export class UpdateSwitchDto extends PartialType(CreateSwitchDto) {
  @ApiProperty()
  label: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  room_id: number;
}
