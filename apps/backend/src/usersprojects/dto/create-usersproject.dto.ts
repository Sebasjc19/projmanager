import { IsNotEmpty, IsNumber } from "class-validator";
import { UserRole } from "../enums/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";


export class CreateUsersprojectDto {
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
        example: 'member',
        description: 'The role of the user in the project.',
    })
    @IsNotEmpty()
    role: UserRole;
}
