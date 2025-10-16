import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { UserRole } from '../../usersprojects/enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { UserProject } from '../../usersprojects/entities/usersproject.entity';
import { Task } from '../../tasks/entities/task.entity';
import * as bcrypt from 'bcrypt';

/**
 * User entity representing a person with projects and tasks.
 */
@Entity('users')
export class User {
    /** User unique identifier. */
    @PrimaryGeneratedColumn()
    id: number;

    /** Name of the user. */
    @Column({ length: 100 })
    name: string;

    /** Email of the user */
    @Column({ unique: true })
    email: string;

    /** Password ot he user */
    @Exclude()
    @Column()
    password: string;

    /** Projects assigned to this user */
    @OneToMany(() => UserProject, userProject => userProject.user)
    userProjects: UserProject[];

    /** Tasks assigned to this user */
    @ManyToMany(() => Task, task => task.assignedUsers)
    tasks: Task[];

    /** Password encrypt with salt */
    @BeforeInsert()
    async hashPassword(): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

}
