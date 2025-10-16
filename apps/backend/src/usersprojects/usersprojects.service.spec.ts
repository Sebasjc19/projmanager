import { Test, TestingModule } from '@nestjs/testing';
import { UsersprojectsService } from './usersprojects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProject } from './entities/usersproject.entity';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersprojectsService', () => {
  let service: UsersprojectsService;
  let userProjectRepository: any;
  let usersService: any;
  let projectsService: any;

  userProjectRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  usersService = {
    findOne: jest.fn(),
  };

  projectsService = {
    findOne: jest.fn(),
  };


  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersprojectsService,
        { provide: getRepositoryToken(UserProject), useValue: userProjectRepository },
        { provide: UsersService, useValue: usersService },
        { provide: ProjectsService, useValue: projectsService },
      ],
    }).compile();

    service = module.get<UsersprojectsService>(UsersprojectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a userProject', async () => {
      const dto = { userId: 1, projectId: 2, role: 'DEV' };
      const user = { id: 1 };
      const project = { id: 2 };
      const userProject = { ...dto, user, project };

      usersService.findOne.mockResolvedValue(user);
      projectsService.findOne.mockResolvedValue(project);
      userProjectRepository.create.mockReturnValue(userProject);
      userProjectRepository.save.mockResolvedValue(userProject);

      const result = await service.create(dto);

      expect(usersService.findOne).toHaveBeenCalledWith(dto.userId);
      expect(projectsService.findOne).toHaveBeenCalledWith(dto.projectId);
      expect(userProjectRepository.create).toHaveBeenCalledWith({
        user,
        project,
        role: dto.role,
      });
      expect(userProjectRepository.save).toHaveBeenCalledWith(userProject);
      expect(result).toEqual(userProject);
    });
  });

  describe('findAll', () => {
    it('should return all userProjects', async () => {
      const userProjects = [{ id: 1 }, { id: 2 }];
      userProjectRepository.find.mockResolvedValue(userProjects);

      const result = await service.findAll();
      expect(userProjectRepository.find).toHaveBeenCalledWith({ relations: ['user', 'project'] });
      expect(result).toEqual(userProjects);
    });
  });

  describe('findOne', () => {
    it('should return a userProject if found', async () => {
      const userProject = { id: 1 };
      userProjectRepository.findOneBy.mockResolvedValue(userProject);

      const result = await service.findOne(1);
      expect(result).toEqual(userProject);
    });

    it('should throw NotFoundException if not found', async () => {
      userProjectRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a userProject and return it', async () => {
      const dto = { userId: 1, projectId: 2, role: 'QA' };
      const updated = { id: 1, user: { id: 1 }, project: { id: 2 }, role: 'QA' };

      userProjectRepository.update.mockResolvedValue({});
      userProjectRepository.findOneBy.mockResolvedValue(updated);

      const result = await service.update(1, dto);
      expect(userProjectRepository.update).toHaveBeenCalledWith(1, {
        user: { id: dto.userId },
        project: { id: dto.projectId },
        role: dto.role,
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a userProject', async () => {
      const userProject = { id: 1 };
      userProjectRepository.findOneBy.mockResolvedValue(userProject);

      await service.remove(1);
      expect(userProjectRepository.remove).toHaveBeenCalledWith(userProject);
    });

    it('should throw NotFoundException if userProject does not exist', async () => {
      userProjectRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserAndProject', () => {
    it('should return a userProject if found', async () => {
      const userProject = { id: 1 };
      userProjectRepository.findOne.mockResolvedValue(userProject);

      const result = await service.findByUserAndProject(1, 2);
      expect(result).toEqual(userProject);
    });

    it('should throw NotFoundException if not found', async () => {
      userProjectRepository.findOne.mockResolvedValue(null);
      await expect(service.findByUserAndProject(1, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllProjectsByUser', () => {
    it('should return projects for a user', async () => {
      const projects = [{ id: 1 }, { id: 2 }];
      userProjectRepository.find.mockResolvedValue(projects);

      const result = await service.findAllProjectsByUser(1);
      expect(userProjectRepository.find).toHaveBeenCalledWith({ where: { user: { id: 1 } } });
      expect(result).toEqual(projects);
    });

    it('should throw NotFoundException if no projects', async () => {
      userProjectRepository.find.mockResolvedValue([]);
      await expect(service.findAllProjectsByUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllUsersByProject', () => {
    it('should return users for a project', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      userProjectRepository.find.mockResolvedValue(users);

      const result = await service.findAllUsersByProject(1);
      expect(userProjectRepository.find).toHaveBeenCalledWith({ where: { project: { id: 1 } } });
      expect(result).toEqual(users);
    });

    it('should throw NotFoundException if no users', async () => {
      userProjectRepository.find.mockResolvedValue([]);
      await expect(service.findAllUsersByProject(1)).rejects.toThrow(NotFoundException);
    });
  });
});
