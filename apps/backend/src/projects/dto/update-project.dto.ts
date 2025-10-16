import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
    @ApiPropertyOptional({
        example: 'Updated Project Title',
        description: 'The new title of the project. Optional field.',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        example: 'An updated description with more context about the project goals.',
        description: 'A new or updated description for the project. Optional field.',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: '2025-11-01',
        description: 'New start date of the project in ISO 8601 format. Optional field.',
        type: String,
        format: 'date',
    })
    @IsOptional()
    @IsDate()
    startDate?: Date;

    @ApiPropertyOptional({
        example: '2026-06-30',
        description: 'New end date of the project in ISO 8601 format. Optional field.',
        type: String,
        format: 'date',
    })
    @IsOptional()
    @IsDate()
    endDate?: Date;
}
