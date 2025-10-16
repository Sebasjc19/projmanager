import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProjectDto {
    @ApiProperty({
        example: 'Project Phoenix',
        description: 'The title or name of the project.',
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: 'A new AI-powered analytics dashboard for internal use.',
        description: 'A short description explaining the purpose or details of the project.',
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: '2025-10-15',
        description: 'The start date of the project in ISO 8601 format (YYYY-MM-DD).',
        type: String,
        format: 'date',
    })
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({
        example: '2026-03-31',
        description: 'The end date of the project in ISO 8601 format (YYYY-MM-DD).',
        type: String,
        format: 'date', 
    })
    @IsDateString()
    @IsNotEmpty()
    endDate: string;
}
