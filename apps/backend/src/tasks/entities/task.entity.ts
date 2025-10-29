import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { TaskState } from '../enums/task-state.enum';
/**
 * Task entity representing a single task within a project.
 */
@Entity()
export class Task {
  /** Task unique identifier. */
  @PrimaryGeneratedColumn()
  id: number;

  /** Short title of the task. */
  @Column()
  title: string;

  /** Optional deatiled project description. */
  @Column({ nullable: true })
  description: string;

  /** Current state of the task. */
  @Column({
    type: 'enum',
    enum: TaskState,
    default: TaskState.TODO,
  })
  state: TaskState;

  /** Start date of the task. */
  @Column()
  startDate: Date;

  /** Expected or actual end date. */
  @Column()
  endDate: Date;

  /** The project to which this task belongs. */
  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  /** Users assigned to work on this task. */
  @ManyToMany(() => User, user => user.tasks)
  @JoinTable()
  assignedUsers: User[];
}
