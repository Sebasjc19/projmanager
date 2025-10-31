import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersprojectsModule } from 'src/usersprojects/usersprojects.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => TasksModule), forwardRef(() => UsersprojectsModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
