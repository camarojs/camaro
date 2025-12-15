import { Class } from "type-fest";
import { ServiceToken } from "../types.js";
import { DI_DEPENDENCIES_KEY, ServiceLifetime } from "./constants.js";

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

    /**
     * Accesses dependency metadata using the Stage 3 TC39 decorators proposal.
     * This relies on `Symbol.metadata`, which is not yet a standard feature.
     * It expects `this.type[Symbol.metadata]` to be an object mapping symbols
     * (such as `DI_DEPENDENCIES_KEY`) to arrays of `ServiceToken`s.
     * If the decorators proposal changes, this code may need to be updated.
     */
    get dependencies() {
        const metadata = this.type[Symbol.metadata] as Record<symbol, ServiceToken[]> | undefined;
        return metadata?.[DI_DEPENDENCIES_KEY] ?? [];
    }

    constructor(token: ServiceToken<T>, type: Class<T>, lifetime: ServiceLifetime) {
        this.#token = token;
        this.#type = type;
        this.#lifetime = lifetime;
    }
}
