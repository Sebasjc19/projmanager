import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { UserRole } from '../../users/enums/user-role.enum';

@Entity()
export class UserProject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userProjects, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Project, project => project.userProjects, { onDelete: 'CASCADE' })
  project: Project;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;
}
