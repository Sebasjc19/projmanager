import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Basic user response without related entities.
 */
export class UserResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Sebas Jaramillo' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'sebas@example.com' })
  @Expose()
  email: string;
}
