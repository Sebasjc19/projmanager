import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/**
 * Custom parameter decorator to extract the authenticated user from the request.
 * 
 * @param data - Optional property name to extract from the user object (e.g., 'userid', 'email')
 * @returns The full user object or a specific property if data is provided
 * 
 * @example
 * // Get full user object
 * async getProfile(@GetUser() user: User) { ... }
 * 
 * @example
 * // Get specific property
 * async getProfile(@GetUser('userid') userId: number) { ... }
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
