import { Constructor, ServiceToken } from "../types";
import ServiceCollection from "./service-collection";
import ServiceDescriptor from "./service-descriptor";
import ServiceLifeTime from "./service-lifetime";

export default class ServiceProvider {
    /**
     * All registered services.
     */
    #services = new ServiceCollection();

    /**
     * All created instances.
     */
    #instances = new Map<ServiceDescriptor, unknown>();

    register(serviceToken: ServiceToken, serviceType: Constructor, lifetime: ServiceLifeTime) {
        const descriptor = new ServiceDescriptor(serviceToken, serviceType, lifetime);

        this.#services.add(descriptor);
    }

    resolve<T>(serviceToken: ServiceToken<T>): T {
        const descriptor = this.#services.get(serviceToken);

        if (!descriptor) {
            throw new Error(`No service was found for token: ${serviceToken.toString()}`);
        }

        return this.#getOrCreateInstance(descriptor) as T;
    }

    resolveAll<T>(serviceToken: ServiceToken<T>): T[] {
        const descriptors = this.#services.getAll(serviceToken);

        if (descriptors.length === 0) {
            throw new Error(`No service was found for token: ${serviceToken.toString()}`);
        }

        return descriptors.map((descriptor) => {
            return this.#getOrCreateInstance(descriptor) as T;
        });
    }

    #getOrCreateInstance(descriptor: ServiceDescriptor) {
        let instance: unknown;

        switch (descriptor.lifetime) {
            case ServiceLifeTime.Singleton:

                if (this.#instances.has(descriptor)) {
                    instance = this.#instances.get(descriptor);
                }
                else {
                    instance = new descriptor.serviceType();
                    this.#instances.set(descriptor, instance);
                }

                break;
            default:
                instance = new descriptor.serviceType();
        }

        return instance;
    }

    /**
     * Global instance of the service provider.
     */
    static #instance = new ServiceProvider();

    static register(serviceToken: ServiceToken, serviceType: Constructor, lifetime: ServiceLifeTime) {
        this.#instance.register(serviceToken, serviceType, lifetime);
    }

    static resolve<T>(serviceToken: ServiceToken<T>): T {
        return this.#instance.resolve(serviceToken);
    }

    static resolveAll<T>(serviceToken: ServiceToken<T>): T[] {
        return this.#instance.resolveAll(serviceToken);
    }
}
