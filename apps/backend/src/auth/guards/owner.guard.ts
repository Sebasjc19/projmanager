// auth/guards/owner.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = Number(request.params.userId);

    if (!user) throw new UnauthorizedException('User not authenticated');
    if (user.userid !== paramId) {
      throw new ForbiddenException('You are not allowed to perform this action');
    }

    return true;
  }
}
