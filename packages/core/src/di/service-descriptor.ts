import { Class } from "type-fest";
import { ServiceToken } from "../types.js";
import { ServiceLifetime } from "./constants.js";

export class ServiceDescriptor<T = unknown> {
    #token: ServiceToken<T>;
    #type: Class<T>;
    #lifetime: ServiceLifetime;
    #dependencies: ServiceToken[];

    get token() {
        return this.#token;
    }

    get type() {
        return this.#type;
    }

    get lifetime() {
        return this.#lifetime;
    }

    get dependencies() {
        return this.#dependencies;
    }

    constructor(token: ServiceToken<T>, type: Class<T>, lifetime: ServiceLifetime, dependencies: ServiceToken[] = []) {
        this.#token = token;
        this.#type = type;
        this.#lifetime = lifetime;
        this.#dependencies = dependencies;
    }
}
