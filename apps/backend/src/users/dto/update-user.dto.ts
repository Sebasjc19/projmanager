import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Alba',
    description: 'The name of the user.',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'alba@example.com',
    description: 'The email of the user.',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '123456',
    description: 'The password of the account.',
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
