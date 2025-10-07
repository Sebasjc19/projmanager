import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductionGuard implements CanActivate {

    constructor(private readonly configService: ConfigService){}

  canActivate(context: ExecutionContext): boolean {
    
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    console.log(nodeEnv)
    if (nodeEnv === 'PRODUCTION') {
      throw new ForbiddenException('This endpoint is disabled in production');
    }
    return true;
  }
}
