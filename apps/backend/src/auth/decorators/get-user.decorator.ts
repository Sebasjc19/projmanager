import { createParamDecorator, ExecutionContext } from '@nestjs/common';
interface RequestWithUser extends Request {
  user: {
    userid: number;
    useremail: string;
  };
}
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
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    return data ? user?.[data as keyof typeof user] : user;
  },
);
