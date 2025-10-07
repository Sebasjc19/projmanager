import { Test, TestingModule } from '@nestjs/testing';
import { UsersprojectsController } from './usersprojects.controller';
import { UsersprojectsService } from './usersprojects.service';
import { UserProject } from './entities/usersproject.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductionGuard } from '../common/guards/production.guard';
import { ConfigService } from '@nestjs/config';

describe('UsersprojectsController', () => {
  let controller: UsersprojectsController;
  let usersprojectsService: UsersprojectsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersprojectsController],
      providers: [
        UsersprojectsService,
        ProductionGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('DEV')
          },
        },
        {
          provide: getRepositoryToken(UserProject),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          }
        }
      ],
    }).compile();

    controller = module.get<UsersprojectsController>(UsersprojectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
