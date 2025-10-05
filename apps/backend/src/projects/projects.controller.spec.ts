import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {

          },
        },
        {
          provide: UsersprojectsService,
          useValue: {

          },
        }
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
