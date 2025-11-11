import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersprojectsModule } from 'src/usersprojects/usersprojects.module';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectsSchedulerService } from './projects-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task]),
    forwardRef(() => UsersprojectsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => UsersModule)
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsSchedulerService
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
