import { Class } from "type-fest";
import { ServiceToken } from "../types.js";
import { ServiceLifetime } from "./constants.js";

export class ServiceDescriptor<T = unknown> {
    #token: ServiceToken<T>;
    #type: Class<T>;
    #lifetime: ServiceLifetime;

    get token() {
        return this.#token;
    }

    get type() {
        return this.#type;
    }

    get lifetime() {
        return this.#lifetime;
    }

    constructor(token: ServiceToken<T>, type: Class<T>, lifetime: ServiceLifetime) {
        this.#token = token;
        this.#type = type;
        this.#lifetime = lifetime;
    }
}
