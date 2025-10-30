import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiStandardResponse } from 'src/common/decorators/api-response.decorators';
import { ApiCommonErrors } from 'src/common/decorators/api-error-response.decorators';
/**
 * Authentication controller.
 * Handles user login and token generation.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiStandardResponse(AuthResponseDto, 'JWT Token successfully created.')
  @ApiCommonErrors({
    badRequest: true,
    unauthorized: true,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }
}
