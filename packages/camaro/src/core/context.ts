import z from "zod";

type InferSchema<T> = T extends z.ZodType ? z.infer<T> : T;

export interface ContextShape {
    query?: unknown;
    params?: unknown;
    body?: unknown;
    headers?: unknown;
}

export class Context<T extends ContextShape = ContextShape> implements ContextShape {
    query!: InferSchema<T["query"]>;
    params!: InferSchema<T["params"]>;
    body!: InferSchema<T["body"]>;
    headers!: InferSchema<T["headers"]>;

    constructor(init?: Partial<Context<T>>) {
        Object.assign(this, init);
    }
}
