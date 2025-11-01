import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';
/**
 * Options for configuring which error responses to include in API documentation.
 */
interface ApiErrorOptions {
  /** Include 400 Bad Request error (invalid input data) */
  badRequest?: boolean;
  /** Include 401 Unauthorized error (missing or invalid authentication) */
  unauthorized?: boolean;
  /** Include 403 Forbidden error (insufficient permissions) */
  forbidden?: boolean;
  /** Include 404 Not Found error (resource not found) */
  notFound?: boolean;
  /** Include 409 Conflict error (resource already exists) */
  conflict?: boolean;
}

/**
 * Decorator that adds common error responses to Swagger documentation.
 * Only includes the error types specified in the options.
 *
 * @param options - Configuration object specifying which errors to document
 * @returns Combined decorator with selected error responses
 *
 * @example
 * // Document only validation and authentication errors
 * @ApiCommonErrors({ badRequest: true, unauthorized: true })
 *
 * @example
 * // Document resource not found error
 * @ApiCommonErrors({ notFound: true, unauthorized: true })
 */
export const ApiCommonErrors = (options: ApiErrorOptions = {}) => {
  const {
    badRequest = false,
    unauthorized = false,
    forbidden = false,
    notFound = false,
    conflict = false,
  } = options;

  const decorators = [ApiExtraModels(ErrorResponseDto)];

  if (badRequest) {
    decorators.push(
      ApiBadRequestResponse({
        description: 'Bad request - Invalid input data',
        type: ErrorResponseDto,
      }),
    );
  }

  if (unauthorized) {
    decorators.push(
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing authentication',
        type: ErrorResponseDto,
      }),
    );
  }

  if (forbidden) {
    decorators.push(
      ApiForbiddenResponse({
        description: 'Forbidden - Insufficient permissions',
        type: ErrorResponseDto,
      }),
    );
  }

  if (notFound) {
    decorators.push(
      ApiNotFoundResponse({
        description: 'Not found - Resource not found',
        type: ErrorResponseDto,
      }),
    );
  }

  if (conflict) {
    decorators.push(
      ApiConflictResponse({
        description: 'Conflict - Resource already exists',
        type: ErrorResponseDto,
      }),
    );
  }

  return applyDecorators(...decorators);
};
