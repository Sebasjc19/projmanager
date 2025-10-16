import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for handling authentication.
 * 
 * Provides methods to validate user credentials and generate JWT access tokens.
 * This service interacts with the UsersService to retrieve user information
 * and with JwtService to sign tokens.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Validates a user's email and password.
   * 
   * Checks if a user exists with the provided email, and compares the provided password
   * with the hashed password stored in the database.
   * 
   * @param email - The email of the user attempting to authenticate.
   * @param pass - The plaintext password provided by the user.
   * @returns The user object without the password field if credentials are valid, or null if invalid.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Generates a JWT access token for an authenticated user.
   * 
   * Creates a JWT payload containing the user's email and ID, then signs it using JwtService.
   * 
   * @param user - The authenticated user object (must include at least `id` and `email`).
   * @returns An object containing the signed JWT access token.
   */
  async login(user: any) {
    const payload = { useremail: user.email, userid: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}