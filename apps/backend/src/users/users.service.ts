import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../usersprojects/enums/user-role.enum';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
/**
 * Service responsible for managing application users.
 * 
 * Provides methods to create, retrieve, update, and delete user entities.
 * Also includes helper methods for fetching users by ID or email.
 * 
 * This service interacts directly with the database through the User repository
 * and ensures proper exception handling for common scenarios such as duplicate emails
 * or missing records.
 */
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user.
   * 
   * @param createUserDto Data Transfer Object containing the user details.
   * @returns The created user entity.
   * @throws {ConflictException} If the email specified already exist.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    try{
      return await this.userRepository.save(user);  
    } catch (error){
      if (error) {
        throw new ConflictException(`Email ${createUserDto.email} already exist`)
      }
    }
    return await this.userRepository.save(user);
  }

   /**
   * Retrieves all users.
   * 
   * @experimental This method is for testing and debugging purposes.
   * @returns A list of all User entities.
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Retrieves a single user by its ID, including its associated user projects and tasks.
   * 
   * @param id The id of the user to retrieve.
   * @returns The user entity with the specified ID, and its associated user projects and tasks.
   * @throws Error if the user with the specified ID is not found
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id }); 
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Retrieves a single user by its EMAIL, including its associated user projects and tasks.
   * 
   * @param email The email of the user to retrieve.
   * @returns The user entity with the specified EMAIL, and its associated user projects and tasks.
   * @throws Error if the user with the specified EMAIL is not found
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  /**
   * Updates an existing user with new details.
   * 
   * @param id - The ID of the project to update. 
   * @param updateUserDto - Data Transfer Object containing updated user details.
   * @returns - The updated user entity.
   * @throws Error if the user with the specified ID is not found.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Removes a user by its ID.
   * 
   * @param id - The ID of the user to remove.
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
  }

}