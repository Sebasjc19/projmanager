import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
/**
 * DTO for creating a new user-project relation.
 */
export class CreateUsersprojectDto {
  /** User id */
  @ApiProperty({
    example: '1',
    description: 'The id of the user.',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  /** Project id */
  @ApiProperty({
    example: '1',
    description: 'The id of the project.',
  })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  /** Role of the user within the project */
  @ApiProperty({
    example: 'member',
    description: 'The role of the user in the project.',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
