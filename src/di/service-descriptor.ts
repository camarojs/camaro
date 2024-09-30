import { Constructor } from "../common/types";
import ServiceLifeTime from "./service-lifetime";
import { ServiceToken } from "./types";

export default class ServiceDescriptor {
    #serviceToken: ServiceToken;
    #serviceType: Constructor;
    #lifetime: ServiceLifeTime;

    get serviceToken() {
        return this.#serviceToken;
    }

    get serviceType() {
        return this.#serviceType;
    }

    get lifetime() {
        return this.#lifetime;
    }

    constructor(serviceToken: ServiceToken, serviceType: Constructor, lifetime: ServiceLifeTime) {
        this.#serviceToken = serviceToken;
        this.#serviceType = serviceType;
        this.#lifetime = lifetime;
    }
}
