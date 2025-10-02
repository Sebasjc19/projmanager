import { Module } from '@nestjs/common';
import { UsersprojectsService } from './usersprojects.service';
import { UsersprojectsController } from './usersprojects.controller';

@Module({
  controllers: [UsersprojectsController],
  providers: [UsersprojectsService],
})
export class UsersprojectsModule {}
