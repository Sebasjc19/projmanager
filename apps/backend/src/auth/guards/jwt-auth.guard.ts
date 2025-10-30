import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
/**
 * Guard that protects routes requiring JWT authentication.
 * Automatically validates the JWT token from the Authorization header.
 *
 * @throws {UnauthorizedException} If token is missing, invalid, or expired
 *
 * @example
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * async getProfile(@GetUser() user: User) { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
