import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../usersprojects/enums/user-role.enum';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/user.dto';
/**
 * Service responsible for managing users.
 * Handles CRUD operations and returns standardized DTOs.
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
   * @param createUserDto User data including name and email
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.userRepository.create(createUserDto);
    try{
      const savedUser = await this.userRepository.save(user);  
      return this.toResponseDto(savedUser);
    } catch (error){
      if (error.code === '23505') {
        throw new ConflictException(`Email ${createUserDto.email} already exist`);
      }
      throw error;
    }
    
  }

  /**
   * Retrieves all users.
   */
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map(user => this.toResponseDto(user));
  }

  /**
   * Retrieves a single user by ID.
   * 
   * @param id User ID
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id }); 
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toResponseDto(user);
  }

  /**
   * Retrieves a single user by email.
   * 
   * @param email User email
   */
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return this.toResponseDto(user);
  }

  /**
   * Retrieves multiple users by IDs.
   * 
   * @param ids Array of user IDs.
   */
  async findByIds(ids: number[]): Promise<User[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const users = await this.userRepository.find({
      where: { id: In(ids) }
    });

    if (users.length !== ids.length) {
      throw new NotFoundException(
        `One or more users not found. Expected ${ids.length}, found ${users.length}`
      );
    }

    return users;
  }

  /**
   * Updates an existing user.
   * 
   * @param id User ID to update
   * @param updateUserDto Updated user data
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return this.toResponseDto(updatedUser);
  }

   /**
   * Deletes a user by ID.
   * 
   * @param id User ID to delete
   */
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({where: { id }});
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
  }

  /**
   * Maps a User entity to a UserResponseEntity.
   */
  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
}