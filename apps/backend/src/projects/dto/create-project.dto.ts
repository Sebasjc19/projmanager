import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProjectDto {
    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsString()
    @IsDate()
    startDate: Date;
    
    @IsNotEmpty()
    @IsDate()
    endDate: Date;

    @IsNumber()
    @IsNotEmpty()
    ownerId: number;
}
