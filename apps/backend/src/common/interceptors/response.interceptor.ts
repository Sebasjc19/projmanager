import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

interface StandardResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
}

interface ResponseData {
  status?: number;
  message?: string;
  data?: unknown;
}

@Injectable()
export class ResponseInterceptor<T = unknown>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (data && typeof data === 'object' && 'status' in data) {
          return data as StandardResponse<T>;
        }
        const responseData = data as ResponseData;

        return {
          status: response.statusCode,
          message: responseData?.message ?? 'Success',
          data: responseData?.data !== undefined ? responseData.data : data,
          timestamp: new Date().toISOString(),
        } as StandardResponse<T>;
      }),
    );
  }
}
