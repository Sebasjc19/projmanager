import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { UserRole } from '../enums/user-role.enum';

/**
 * User project entity representing the relation between user and project
 */
@Entity()
export class UserProject {
  /** User unique identifier. */
  @PrimaryGeneratedColumn()
  id: number;

  /** User assigned to the project */
  @ManyToOne(() => User, (user) => user.userProjects, { onDelete: 'CASCADE' })
  user: User;

  /** Project assigned to the user */
  @ManyToOne(() => Project, (project) => project.userProjects, {
    onDelete: 'CASCADE',
  })
  project: Project;

  /** Role of the user in the project */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;
}
