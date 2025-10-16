import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiBody, ApiCreatedResponse, ApiUnauthorizedResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Validates user credentials and returns a JWT token if successful.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials required for authentication',
  })
  @ApiCreatedResponse({
    description: 'JWT token successfully created.',
    type: String,
  })
  @ApiBadRequestResponse({ 
      description: 'Invalid input data.' 
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password.',
  })
  @Post('login')
  async login(@Body() loginDto : LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Unvalid credentials');
    }

    return this.authService.login(user);
  }
}
