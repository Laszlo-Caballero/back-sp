import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseApi, ResponseExtras } from '../interfaces/interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseApi<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T | ResponseExtras<T>>,
  ): Observable<ResponseApi<T>> | Promise<Observable<ResponseApi<T>>> {
    return next.handle().pipe(
      map((data) => {
        const { data: responseData, token, metadata } = data ?? {};

        return {
          body: responseData ?? data,
          message: 'Request successful',
          status: HttpStatus.OK,
          ...(metadata && { metadata }),
          ...(token && { token }),
        } as ResponseApi<T>;
      }),
    );
  }
}
