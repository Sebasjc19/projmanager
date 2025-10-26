import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Guard that prevents access to endpoints in production environment.
 * Useful for development/testing endpoints that should not be available in production.
 * 
 * @throws {ForbiddenException} If the application is running in production mode
 * 
 * @example
 * @UseGuards(ProductionGuard)
 * @Post('seed')
 * async seedDatabase() { ... }
 */
@Injectable()
export class ProductionGuard implements CanActivate {

  constructor(private readonly configService: ConfigService) { }

  /**
   * Checks if the current environment is production.
   * 
   * @param context - Execution context
   * @returns true if not in production, throws exception otherwise
   * @throws {ForbiddenException} If NODE_ENV is 'PRODUCTION'
   */
  canActivate(context: ExecutionContext): boolean {

    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    if (nodeEnv === 'production') {
      throw new ForbiddenException('This endpoint is disabled in production');
    }
    return true;
  }
}
