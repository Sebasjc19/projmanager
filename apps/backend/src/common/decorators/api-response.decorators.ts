import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';
/**
 * Decorator that documents a successful API response with standardized structure.
 * Wraps the data model in the ApiResponseDto format.
 * 
 * @template TModel - The type of data being returned in the response
 * @param dataModel - The DTO class representing the response data
 * @param successDescription - Description of the successful operation
 * @returns Decorator with documented success response
 * 
 * @example
 * @ApiStandardResponse(UserDto, 'User retrieved successfully')
 * @Get(':id')
 * async findOne(@Param('id') id: string) { ... }
 */
export const ApiStandardResponse = <TModel extends Type<any>>(
  dataModel: TModel,
  successDescription: string = 'Operation successful',
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataModel),
    
    ApiOkResponse({
      description: successDescription,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataModel) },
            },
          },
        ],
      },
    }),
  );
};
