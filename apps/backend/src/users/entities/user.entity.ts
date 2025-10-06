import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { UserProject } from '../../usersprojects/entities/usersproject.entity';
import { Task } from '../../tasks/entities/task.entity';
import * as bcrypt from 'bcrypt';

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

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

}
