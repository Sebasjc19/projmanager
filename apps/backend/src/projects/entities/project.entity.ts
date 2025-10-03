import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserProject } from '../../usersprojects/entities/usersproject.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany(() => UserProject, userProject => userProject.project)
  userProjects: UserProject[];

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];
}
