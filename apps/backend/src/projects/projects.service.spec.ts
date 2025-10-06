import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';


describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: any;

  beforeEach(async () => {
    projectRepository = { 
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const userProjectsServiceMock = { 
      create: jest.fn(),
    };


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: projectRepository,
        },
        { 
          provide: UsersprojectsService, useValue: userProjectsServiceMock,
        }, 
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project', async () => {
    const dto = { title: 'Test Project', description: 'A test project', startDate: new Date(), endDate: new Date() };
    const ownerId = 1;
    const project = { id: 1, ...dto };

    projectRepository.save.mockResolvedValue(project);

    const result = await service.create(dto as any, ownerId);
    
    expect(projectRepository.save).toHaveBeenCalledWith({
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
    expect(result).toBe(project);

  });

  it('should find all projects', async () => {
    const projects = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];
    projectRepository.find.mockResolvedValue(projects);

    const result = await service.findAll();
    expect(projectRepository.find).toHaveBeenCalledWith({
      relations: ['userProjects', 'tasks'],
    });
    expect(result).toBe(projects);
  });

  it('should find one project by id', async () => {
    const project = { id: 1, title: 'A' };
    projectRepository.findOne.mockResolvedValue(project);

    const result = await service.findOne(1);
    expect(projectRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['userProjects', 'tasks'],
    });
    expect(result).toBe(project);
  });

  it('should update a project', async () => {
    const dto = { title: 'Updated Project' };
    const project = { id: 1, ...dto };

    projectRepository.update.mockResolvedValue(undefined);
    projectRepository.findOne.mockResolvedValue(project);

    const result = await service.update(1, dto as any);
    
    expect(projectRepository.update).toHaveBeenCalledWith(1, dto);
    expect(projectRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['userProjects', 'tasks'],
    });
    expect(result).toBe(project);
  });

  it('should remove a project', async () => {
    const project = { id: 1, title: 'A' };
    projectRepository.findOne.mockResolvedValue(project);
    projectRepository.remove.mockResolvedValue(undefined);

    await service.remove(1);
    
    expect(projectRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['userProjects', 'tasks'],
    });
    expect(projectRepository.remove).toHaveBeenCalledWith(project);
  });
});
