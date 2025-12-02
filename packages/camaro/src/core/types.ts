import { Class } from "type-fest";

export type ServiceToken<T = unknown> = Class<T> | string | symbol;
