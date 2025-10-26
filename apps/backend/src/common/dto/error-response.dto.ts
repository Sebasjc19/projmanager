import { ApiProperty } from '@nestjs/swagger';
/**
 * Standardized error response structure.
 * Used by the exception filter to format all error responses consistently.
 */
export class ErrorResponseDto {
  /** Detailed error message explaining what went wrong */
  @ApiProperty({
    example: 'Invalid user data',
    description: 'Detailed error message'
  })
  message: string;

  /** Error type or category (e.g., 'Unauthorized', 'BadRequest') */
  @ApiProperty({
    example: 'Unauthorized',
    description: 'Error type or name'
  })
  error: string;

  /** HTTP status code of the error response */
  @ApiProperty({
    example: 401,
    description: 'HTTP status code'
  })
  statusCode: number;
}
