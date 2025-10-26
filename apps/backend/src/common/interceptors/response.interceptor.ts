import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * Global interceptor that transforms all successful responses into a standardized format.
 * Wraps response data in the ApiResponseDto structure with status, message, data, and timestamp.
 * 
 * If the response already has a 'status' property, it's returned as-is to avoid double wrapping.
 * 
 * @example
 * // Input from controller: { id: 1, name: 'John' }
 * // Output: { status: 200, message: 'Success', data: { id: 1, name: 'John' }, timestamp: '...' }
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * Intercepts the response and wraps it in a standardized structure.
   * 
   * @param context - Execution context
   * @param next - Call handler for the next interceptor or route handler
   * @returns Observable with transformed response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        
        if (data && typeof data === 'object' && 'status' in data) {
          return data;
        }

        return {
          status: response.statusCode,
          message: data?.message || 'Success',
          data: data?.data !== undefined ? data.data : data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
