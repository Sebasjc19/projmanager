import { forwardRef, Module } from '@nestjs/common';
import { UsersprojectsService } from './usersprojects.service';
import { UsersprojectsController } from './usersprojects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProject } from './entities/usersproject.entity';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProject, User, Project]),
    forwardRef(()=> ProjectsModule) ,
    forwardRef(()=> UsersModule)
  ],
  controllers: [UsersprojectsController],
  providers: [UsersprojectsService],
  exports: [UsersprojectsService],
})
export class UsersprojectsModule {}
