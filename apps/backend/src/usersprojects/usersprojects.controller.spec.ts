import { Test, TestingModule } from '@nestjs/testing';
import { UsersprojectsController } from './usersprojects.controller';
import { UsersprojectsService } from './usersprojects.service';

describe('UsersprojectsController', () => {
  let controller: UsersprojectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersprojectsController],
      providers: [UsersprojectsService],
    }).compile();

    controller = module.get<UsersprojectsController>(UsersprojectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
