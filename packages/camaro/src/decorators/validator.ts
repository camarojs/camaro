import z from "zod";
import { Context, ContextShape } from "../core/context.js";

export type ValidationSchemas = {
    [key in keyof ContextShape]?: z.ZodType;
};

export const Validator = <T extends ValidationSchemas>(validationSchemas: T) => {
    return <This = unknown, Return = unknown>(
        method: (this: This, ctx: Context<T>) => Return,
        context: ClassMethodDecoratorContext<This, (ctx: Context<T>) => Return>,
    ) => {
        context.metadata.validationSchemas = validationSchemas;

        return function (this: This, ctx: Context<T>) {
            return method.call(this, ctx);
        };
    };
};
