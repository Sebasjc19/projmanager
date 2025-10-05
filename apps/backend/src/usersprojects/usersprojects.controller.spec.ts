import { Test, TestingModule } from '@nestjs/testing';
import { UsersprojectsController } from './usersprojects.controller';
import { UsersprojectsService } from './usersprojects.service';
import { UserProject } from './entities/usersproject.entity';
import { get } from 'http';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersprojectsController', () => {
  let controller: UsersprojectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersprojectsController],
      providers: [
        UsersprojectsService,
        {
          provide: getRepositoryToken(UserProject),
          useValue: {

          },
        }
      ],
    }).compile();

    controller = module.get<UsersprojectsController>(UsersprojectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
