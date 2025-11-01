import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
/**
 * Response DTO for authentication endpoints.
 * Returns the JWT access token after successful login.
 */
export class AuthResponseDto {
  /**
   * JWT access token for authenticated requests.
   * Must be included in the Authorization header as 'Bearer <token>'
   */
  @ApiProperty({
    description: 'JWT access token for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  access_token: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: number;
    name: string;
    email: string;
  };
}
