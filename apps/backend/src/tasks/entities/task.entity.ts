import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { TaskState } from '../enums/task-state.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TaskState,
    default: TaskState.TODO,
  })
  state: TaskState;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToMany(() => User, user => user.tasks)
  @JoinTable()
  assignedUsers: User[];
}
