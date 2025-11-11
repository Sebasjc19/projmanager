import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Response } from 'express';
import { throwError } from 'rxjs';

interface StandardResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T = unknown>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    return next.handle().pipe(
      tap((data) => {
        console.log('[Interceptor] Data recibida:', data);
      }),
      map((data: unknown) => {
        const statusCode = response.statusCode;
        if (
          data &&
          typeof data === 'object' &&
          'status' in data &&
          'timestamp' in data
        ) {
          console.log('[Interceptor] Ya es StandardResponse');
          return data as StandardResponse<T>;
        }
        const wrapped: StandardResponse<T> = {
          status: statusCode,
          message: this.getStatusMessage(statusCode),
          data: data as T,
          timestamp: new Date().toISOString(),
        };
        return wrapped;
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  private getStatusMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      200: 'Success',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    };

    return messages[statusCode] || 'Success';
  }
}
