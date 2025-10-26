import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
/**
 * Guard that ensures the authenticated user is the owner of the resource.
 * Compares the user's ID from the JWT with the userId parameter in the route.
 * 
 * @throws {UnauthorizedException} If user is not authenticated
 * @throws {ForbiddenException} If user ID doesn't match the resource owner ID
 * 
 * @example
 * @UseGuards(JwtAuthGuard, OwnerGuard)
 * @Put('users/:userId/profile')
 * async updateProfile(@Param('userId') userId: string) { ... }
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
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
