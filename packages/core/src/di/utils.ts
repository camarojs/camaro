import { ServiceToken } from "../types.js";
import { ServiceDescriptor } from "./service-descriptor.js";

export const resolveTokenName = (token: ServiceToken) => {
    if (typeof token === "function" && token.name) {
        return token.name;
    }

    return String(token);
};

export const createInstance = <T = unknown>(descriptor: ServiceDescriptor<T>) => {
    const instance = new descriptor.type();
    return instance;
};
