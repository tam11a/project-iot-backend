import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({
    default: 1,
  })
  sensors?: number;

  @ApiProperty({
    default: 1,
  })
  switches?: number;
}
