import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersprojectDto } from './create-usersproject.dto';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsersprojectDto{
    @ApiProperty({
            example: '1',
            description: 'The id of the user.',
    })
    @IsNumber()
    userId: number;

    @ApiProperty({
        example: '1',
        description: 'The id of the project.',
    })
    @IsNumber()
    projectId: number;

    @ApiProperty({
        example: 'admin',
        description: 'The new role of the user in the project.',
    })
    @IsNotEmpty()
    role: UserRole;
}
