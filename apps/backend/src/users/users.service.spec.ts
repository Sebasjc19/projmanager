import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { find } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;

  beforeEach(async () => {
    userRepository = { 
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findOneBy: jest.fn(),  
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { 
          provide: getRepositoryToken(User), useValue: userRepository
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { name: 'Test' };
    const user = { id: 1, ...dto };
    userRepository.create.mockReturnValue(user);
    userRepository.save.mockResolvedValue(user);

    const result = await service.create(dto as any);
    
    expect(userRepository.create).toHaveBeenCalledWith(dto);
    expect(userRepository.save).toHaveBeenCalledWith(user);
    expect(result).toBe(user);
  });

  it('should find all users', async () => {
    const users = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    userRepository.find.mockResolvedValue(users);

    const result = await service.findAll();
    expect(userRepository.find).toHaveBeenCalled();
    expect(result).toBe(users);
  });

    it('should find one user by id', async () => {
    const user = { id: 1, name: 'A' };
    userRepository.findOneBy.mockResolvedValue(user);

    const result = await service.findOne(1);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toBe(user);
  });

  it('should throw error if user not found in findOne', async () => {
    userRepository.findOneBy.mockResolvedValue(undefined);

    await expect(service.findOne(99)).rejects.toThrow('User with ID 99 not found');
  });

  it('should update a user', async () => {
    const user = { id: 1, name: 'A' };
    const updateDto = { name: 'B' };
    userRepository.findOneBy.mockResolvedValue(user);
    userRepository.save.mockResolvedValue({ ...user, ...updateDto });

    const result = await service.update(1, updateDto as any);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(userRepository.save).toHaveBeenCalledWith({ ...user, ...updateDto });
    expect(result).toEqual({ ...user, ...updateDto });
  });

  it('should throw error if user not found in update', async () => {
    userRepository.findOneBy.mockResolvedValue(undefined);

    await expect(service.update(99, { name: 'X' } as any)).rejects.toThrow('User with ID 99 not found');
  });

  it('should remove a user', async () => {
    const user = { id: 1, name: 'A' };
    userRepository.findOneBy.mockResolvedValue(user);
    userRepository.remove.mockResolvedValue(undefined);

    await service.remove(1);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(userRepository.remove).toHaveBeenCalledWith(user);
  });

  it('should throw error if user not found in remove', async () => {
    userRepository.findOneBy.mockResolvedValue(undefined);

    await expect(service.remove(99)).rejects.toThrow('User with ID 99 not found');
  });

});
