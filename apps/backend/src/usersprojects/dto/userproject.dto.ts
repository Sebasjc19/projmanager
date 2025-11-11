import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { UserResponseDto } from 'src/users/dto/user.dto';
import { ProjectResponseDto } from 'src/projects/dto/project.dto';

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

/**
 * Dto with user details
 */
export class ProjectUserWithDetailsResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  project: number;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({ example: UserRole.MEMBER })
  @Expose()
  role: UserRole;
}

/**
 * Dto with project details
 */
export class UserProjectWithDetailsResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  user: number;

  @Expose()
  @Type(() => ProjectResponseDto)
  project: ProjectResponseDto

  @ApiProperty({ example: UserRole.MEMBER })
  @Expose()
  role: UserRole;
}