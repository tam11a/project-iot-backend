import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  description?: string;
}
