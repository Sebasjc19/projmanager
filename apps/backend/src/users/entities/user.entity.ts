import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { UserProject } from '../../usersprojects/entities/usersproject.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('users') // Table name in the database
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @OneToMany(() => UserProject, userProject => userProject.user)
    userProjects: UserProject[];

    @ManyToMany(() => Task, task => task.assignedUsers)
    tasks: Task[];
}
