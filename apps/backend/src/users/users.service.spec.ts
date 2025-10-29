import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

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

  describe('create', () => {
    it('should create a user and return DTO', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com', password: 'hashedPass' };
      const savedUser = { id: 1, ...dto };

      userRepository.create.mockReturnValue(dto);
      userRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(dto as any);

      expect(userRepository.create).toHaveBeenCalledWith(dto);
      expect(userRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto = { name: 'John Doe', email: 'existing@example.com', password: 'pass' };
      const duplicateError = { code: '23505' };

      userRepository.create.mockReturnValue(dto);
      userRepository.save.mockRejectedValue(duplicateError);

      await expect(service.create(dto as any)).rejects.toThrow(
        new ConflictException('Email existing@example.com already exist')
      );
    });

    it('should rethrow other errors', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com', password: 'pass' };
      const unexpectedError = new Error('Database connection failed');

      userRepository.create.mockReturnValue(dto);
      userRepository.save.mockRejectedValue(unexpectedError);

      await expect(service.create(dto as any)).rejects.toThrow(unexpectedError);
    });
  });


  describe('findAll', () => {
    it('should return all users as DTOs', async () => {
      const users = [
        { id: 1, name: 'User A', email: 'a@example.com' },
        { id: 2, name: 'User B', email: 'b@example.com' },
      ];
      userRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        name: 'User A',
        email: 'a@example.com',
      });
    });

    it('should return empty array when no users exist', async () => {
      userRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID as DTO', async () => {
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
      userRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found')
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email as DTO', async () => {
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
      userRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findByEmail('john@example.com');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findByEmail('notfound@example.com')).rejects.toThrow(
        new NotFoundException('User with email notfound@example.com not found')
      );
    });
  });

  describe('findByIds', () => {
    it('should return multiple users by IDs', async () => {
      const ids = [1, 2, 3];
      const users = [
        { id: 1, name: 'User A', email: 'a@example.com' },
        { id: 2, name: 'User B', email: 'b@example.com' },
        { id: 3, name: 'User C', email: 'c@example.com' },
      ];
      userRepository.find.mockResolvedValue(users);

      const result = await service.findByIds(ids);

      expect(userRepository.find).toHaveBeenCalledWith({
        where: { id: expect.anything() },
      });
      expect(result).toHaveLength(3);
      expect(result).toEqual(users);
    });

    it('should return empty array when ids array is empty', async () => {
      const result = await service.findByIds([]);

      expect(userRepository.find).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return empty array when ids is null', async () => {
      const result = await service.findByIds(null);

      expect(userRepository.find).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when not all users found', async () => {
      const ids = [1, 2, 3];
      const users = [
        { id: 1, name: 'User A' },
        { id: 2, name: 'User B' },
      ];
      userRepository.find.mockResolvedValue(users);

      await expect(service.findByIds(ids)).rejects.toThrow(
        new NotFoundException('One or more users not found. Expected 3, found 2')
      );
    });
  });

  describe('update', () => {
    it('should update a user and return DTO', async () => {
      const updateDto = { name: 'Updated Name' };
      const existingUser = {
        id: 1,
        name: 'Old Name',
        email: 'user@example.com',
      };
      const updatedUser = { ...existingUser, ...updateDto };

      userRepository.findOne.mockResolvedValue(existingUser);
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateDto as any);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual({
        id: 1,
        name: 'Updated Name',
        email: 'user@example.com',
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {} as any)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found')
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: 1, name: 'User A' };
      userRepository.findOne.mockResolvedValue(user);
      userRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(userRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found')
      );
    });
  });

});
