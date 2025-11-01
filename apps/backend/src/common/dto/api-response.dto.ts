import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic standardized API response wrapper.
 * Ensures consistent response structure across all endpoints.
 *
 * @template T - The type of data being returned
 */
export class ApiResponseDto<T> {
  /** HTTP status code of the response */
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  status: number;

  /** Human-readable response message */
  @ApiProperty({
    description: 'Response message',
    example: 'Success',
  })
  message: string;

  /** The actual response data payload */
  @ApiProperty({
    description: 'Response data payload',
  })
  data: T;

  /** ISO 8601 timestamp of when the response was generated */
  @ApiProperty({
    description: 'Response timestamp',
    example: '2025-10-25T15:22:00.000Z',
  })
  timestamp: string;
}
