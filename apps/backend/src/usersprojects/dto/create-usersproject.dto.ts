import { IsNotEmpty, IsNumber } from "class-validator";
import { UserRole } from "../../users/enums/user-role.enum";


export class CreateUsersprojectDto {
    @IsNumber()
    userId: number;
    @IsNumber()
    projectId: number;
    @IsNotEmpty()
    role: UserRole;
}
