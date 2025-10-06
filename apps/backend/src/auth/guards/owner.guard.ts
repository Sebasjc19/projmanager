// auth/guards/owner.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    const paramId = Number(request.params.userid);
    console.log(paramId)

    if (!user) throw new ForbiddenException('User not authenticated');
    if (user.userid !== paramId) {
      throw new ForbiddenException('You are not allowed to delete another user');
    }

    return true;
  }
}
