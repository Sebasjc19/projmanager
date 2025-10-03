import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto{
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;
}
