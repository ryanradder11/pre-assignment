import { ZodError, ZodTypeAny } from "zod";
import type Koa from "koa";

type Schemas = {
    params?: ZodTypeAny;
    body?: ZodTypeAny;
    query?: ZodTypeAny;
};

export function validate(schemas: Schemas) {
    return async (ctx: Koa.Context, next: () => Promise<any>) => {
        try {
            if (schemas.params) {
                ctx.state.params = schemas.params.parse(ctx.params);
            }
            if (schemas.body) {
                ctx.state.body = schemas.body.parse(ctx.request.body);
            }
            if (schemas.query) {
                ctx.state.query = schemas.query.parse(ctx.request.query);
            }
            await next();
        } catch (err) {
            if (err instanceof ZodError) {
                ctx.status = 400;
                ctx.body = {
                    error: "Validation failed",
                    details: err.errors.map(e => ({
                        path: e.path.join("."),
                        message: e.message,
                    })),
                };
                return;
            }
            throw err;
        }
    };
}

