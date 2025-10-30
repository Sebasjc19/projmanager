import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';
/**
 * Decorator that documents a successful API response with standardized structure.
 * Supports different HTTP status codes (200, 201, etc.).
 *
 * @template TModel - The type of data being returned in the response
 * @param dataModel - The DTO class representing the response data
 * @param successDescription - Description of the successful operation
 * @param statusCode - HTTP status code (default: 200)
 * @returns Decorator with documented success response
 *
 * @example
 * // For GET requests (200 OK)
 * @ApiStandardResponse(UserDto, 'User retrieved successfully')
 *
 * @example
 * // For POST requests (201 Created)
 * @ApiStandardResponse(UserDto, 'User created successfully', HttpStatus.CREATED)
 */
export const ApiStandardResponse = <TModel extends Type<any>>(
  dataModel: TModel,
  successDescription: string = 'Operation successful',
  statusCode: HttpStatus = HttpStatus.OK,
) => {
  const schema = {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(dataModel) },
        },
      },
    ],
  };

  const responseDecorator =
    statusCode === HttpStatus.CREATED
      ? ApiCreatedResponse({ description: successDescription, schema })
      : ApiOkResponse({ description: successDescription, schema });

  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataModel),
    responseDecorator,
  );
};
