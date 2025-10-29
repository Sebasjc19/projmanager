import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersprojectDto } from './create-usersproject.dto';
import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
/**
 * DTO for updating an existing user-project relation.
 */
export class UpdateUsersprojectDto{
    /** User role updated */
    @ApiProperty({
        example: UserRole.ADMIN,
        description: 'The new role of the user in the project.',
    })
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;
}
