/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { CacheService } from './services/cache.services';

@Injectable({})
export class GraphqlInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private readonly cacheService: CacheService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<T>> {
    const gqlContext = GqlExecutionContext.create(context);
    const res = gqlContext.getContext().res;

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const info: any = gqlContext.getInfo();
    const args = gqlContext.getArgs();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const cacheKey = `graphql:${info.fieldName}:${
      args && JSON.stringify(args)
    }`;
    const cachedData = await this.cacheService.get(cacheKey);
    console.log(cachedData, new Date().getTime());
    if (cachedData) {
      if (res) {
        res.setHeader('Cache-Control', 'public, max-age=300');
      }
      return of(cachedData as T);
    }

    return next.handle().pipe(
      tap(() => {
        if (res) {
          res.setHeader('Cache-Control', 'public, max-age=300');
        }
      }),
      switchMap((data) =>
        from(this.cacheService.set(cacheKey, data, 6 * 1000)).pipe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          map(() => data),
        ),
      ),
    );
  }
}
