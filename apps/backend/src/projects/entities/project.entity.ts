import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserProject } from '../../usersprojects/entities/usersproject.entity';
import { Task } from '../../tasks/entities/task.entity';
import { projectStatus } from '../enums/project-status.enum';

/**
 * Project entity representing a business project with users and tasks.
 */
@Entity()
export class Project {
  /** Project unique identifier. */
  @PrimaryGeneratedColumn()
  id: number;

  /** Short title of the project. */
  @Column()
  title: string;

  /** Optional detailed project description. */
  @Column({ nullable: true })
  description: string;

  /** Start date of the project. */
  @Column({ type: 'date' })
  startDate: Date;

  /** Expected or actual end date. */
  @Column({ type: 'date' })
  endDate: Date;

  /** Current project status. */
  @Column({ 
    type: 'enum',
    enum: projectStatus,
    default: projectStatus.PLANNED
  })
  status: projectStatus;

  /** Users assigned to this project. */
  @OneToMany(() => UserProject, userProject => userProject.project)
  userProjects: UserProject[];

  /** Tasks belonging to this project. */
  @OneToMany(() => Task, task => task.project)
  tasks: Task[];
}
