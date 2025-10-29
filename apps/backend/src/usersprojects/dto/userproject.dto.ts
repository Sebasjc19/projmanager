import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

/**
 * Basic User-Project response
 */
export class UserProjectResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  user: number;

  @ApiProperty({ example: 1 })
  @Expose()
  project: number;

  @ApiProperty({ example: UserRole.MEMBER })
  @Expose()
  role: UserRole;

}
