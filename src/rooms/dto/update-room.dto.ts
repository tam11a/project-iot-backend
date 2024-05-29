import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends OmitType(CreateRoomDto, [
  'sensors',
  'switches',
] as const) {
  @ApiProperty()
  label: string;

  @ApiProperty()
  description: string;
}
