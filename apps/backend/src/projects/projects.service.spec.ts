import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersprojectsService } from '../usersprojects/usersprojects.service';
import { UserRole } from '../usersprojects/enums/user-role.enum';
import { projectStatus } from './enums/project-status.enum';
import { NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const projectRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const userProjectsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: projectRepository },
        { provide: UsersprojectsService, useValue: userProjectsService },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const dto = {
        title: 'Test Project',
        description: 'A test project',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      };
      const ownerId = 1;
      const savedProject = {
        id: 1,
        ...dto,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: projectStatus.PLANNED,
      };

      projectRepository.create.mockReturnValue(dto);
      projectRepository.save.mockResolvedValue(savedProject);
      userProjectsService.create.mockResolvedValue({});

      const result = await service.create(dto as any, ownerId);

      expect(projectRepository.create).toHaveBeenCalledWith(dto);
      expect(projectRepository.save).toHaveBeenCalledWith(dto);

      expect(userProjectsService.create).toHaveBeenCalledWith({
        userId: ownerId,
        projectId: savedProject.id,
        role: UserRole.OWNER,
      });

      expect(result).toEqual({
        id: savedProject.id,
        title: savedProject.title,
        description: savedProject.description,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: savedProject.status,
      });
    });
  });

  describe('findAll', () => {
    it('should find all projects', async () => {
      const projects = [
        {
          id: 1,
          title: 'Project A',
          description: 'Desc A',
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-12-31'),
          status: projectStatus.ACTIVE,
        },
        {
          id: 2,
          title: 'Project B',
          description: 'Desc B',
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-11-30'),
          status: projectStatus.PLANNED,
        },
      ];
      projectRepository.find.mockResolvedValue(projects);

      const result = await service.findAll();
      expect(projectRepository.find).toHaveBeenCalledWith();
      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        id: 1,
        title: 'Project A',
        description: 'Desc A',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: projectStatus.ACTIVE,
      });
    });

    it('should return empty array when no projects exist', async () => {
      projectRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a project by ID as DTO', async () => {
      const project = {
        id: 1,
        title: 'Test Project',
        description: 'Description',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: projectStatus.ACTIVE,
      };
      projectRepository.findOne.mockResolvedValue(project);

      const result = await service.findOne(1);
      expect(projectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['tasks'],
      });
      expect(result).toEqual({
        id: 1,
        title: 'Test Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: projectStatus.ACTIVE,
      });
    });

    it('should throw NotFoundException when project does not exist', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Project with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a project and return DTO', async () => {
      const updateDto = { title: 'Updated Project' };
      const existingProject = {
        id: 1,
        title: 'Old Title',
        description: 'Description',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: projectStatus.ACTIVE,
      };
      const updatedProject = { ...existingProject, ...updateDto };

      projectRepository.findOne.mockResolvedValue(existingProject);
      projectRepository.save.mockResolvedValue(updatedProject);

      const result = await service.update(1, updateDto as any);

      expect(projectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['tasks'],
      });
      expect(projectRepository.save).toHaveBeenCalledWith(updatedProject);

      expect(result).toEqual({
        id: 1,
        title: 'Updated Project',
        description: 'Description',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: projectStatus.ACTIVE,
      });
    });

    it('should throw NotFoundException when project does not exist', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {} as any)).rejects.toThrow(
        new NotFoundException('Project with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      const project = { id: 1, title: 'A' };
      projectRepository.findOne.mockResolvedValue(project);
      projectRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(projectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(projectRepository.remove).toHaveBeenCalledWith(project);
    });

    it('should throw NotFoundException when project does not exist', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Project with ID 999 not found'),
      );
    });
  });
});
