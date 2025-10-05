import { Test, TestingModule } from '@nestjs/testing';
import { UsersprojectsService } from './usersprojects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProject } from './entities/usersproject.entity';

describe('UsersprojectsService', () => {
  let service: UsersprojectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersprojectsService,
        {
          provide: getRepositoryToken(UserProject),
          useValue: {

          },
        }
      ],
    }).compile();

    service = module.get<UsersprojectsService>(UsersprojectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
