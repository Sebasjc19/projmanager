import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example: 'Ernesto',
        description: 'The name of the user.',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'ernesto@example.com',
        description: 'The email of the user.',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '123456',
        description: 'The password of the account.',
    })
    @IsString()
    @MinLength(6)
    password: string;
}
