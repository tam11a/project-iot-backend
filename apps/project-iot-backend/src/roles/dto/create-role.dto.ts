import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  permissions: string[];
}
