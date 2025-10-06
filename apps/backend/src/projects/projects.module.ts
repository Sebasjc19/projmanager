import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersprojectsModule } from 'src/usersprojects/usersprojects.module';
import { Task } from 'src/tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task]),
    UsersprojectsModule  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
