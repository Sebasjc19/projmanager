import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersprojectDto } from './create-usersproject.dto';

export class UpdateUsersprojectDto extends PartialType(CreateUsersprojectDto) {}
