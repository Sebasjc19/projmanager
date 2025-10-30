import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
/**
 * Data Transfer Object for user login credentials.
 * Contains email and password necessary for authentication
 */
export class LoginDto {
  /** User's email address (must be valid email format) */
  @ApiProperty({
    example: 'sebas@example.com',
    description: 'The email address of the user',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /** User's password (minimum 6 characters) */
  @ApiProperty({
    example: '123456',
    description: 'The password of the user',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
