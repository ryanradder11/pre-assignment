import type Koa from "koa";

export function catchAsync(
    fn: (ctx: Koa.Context) => Promise<any>
): Koa.Middleware {
    return (ctx, next) => fn(ctx).catch(next);
}