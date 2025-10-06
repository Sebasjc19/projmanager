import { Module } from '@nestjs/common';
import { UsersprojectsService } from './usersprojects.service';
import { UsersprojectsController } from './usersprojects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProject } from './entities/usersproject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProject
    ]) 
  ],
  controllers: [UsersprojectsController],
  providers: [UsersprojectsService],
  exports: [UsersprojectsService],
})
export class UsersprojectsModule {}
