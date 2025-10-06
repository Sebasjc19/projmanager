import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProjectDto {
    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;
    
    @IsDateString()
    @IsNotEmpty()
    endDate: string;
}
