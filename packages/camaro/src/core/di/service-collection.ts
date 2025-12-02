import { ServiceLifetime, ServiceProvider } from "../index.js";
import { ServiceToken } from "../types.js";
import { ServiceDescriptor } from "./service-descriptor.js";

export class ServiceCollection {
    #descriptors = new Map<ServiceToken, ServiceDescriptor>();

    /**
     * Adds one or more service descriptors to the collection.
     * If a descriptor with the same token already exists, it will be overwritten.
     * Returns this for method chaining.
     */
    add(...descriptors: ServiceDescriptor[]) {
        for (const descriptor of descriptors) {
            if (this.#descriptors.has(descriptor.token)) {
                console.warn(`Service descriptor for token ${String(descriptor.token)} is being overwritten.`);
            }

            this.#descriptors.set(descriptor.token, descriptor);
        }

        return this;
    }

    addSingleton<T>(serviceToken: ServiceToken<T>, serviceType: new () => T) {
        const descriptor = new ServiceDescriptor(serviceToken, serviceType, ServiceLifetime.Singleton);
        this.add(descriptor);
    }

    addTransient<T>(serviceToken: ServiceToken<T>, serviceType: new () => T) {
        const descriptor = new ServiceDescriptor(serviceToken, serviceType, ServiceLifetime.Transient);
        this.add(descriptor);
    }

    addScoped<T>(serviceToken: ServiceToken<T>, serviceType: new () => T) {
        const descriptor = new ServiceDescriptor(serviceToken, serviceType, ServiceLifetime.Scoped);
        this.add(descriptor);
    }

    buildProvider(parent?: ServiceProvider) {
        return new ServiceProvider(this.#descriptors, parent);
    }
}
