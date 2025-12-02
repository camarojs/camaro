import { ServiceToken } from "../types.js";
import { ServiceLifetime } from "./constants.js";
import { ServiceDescriptor } from "./service-descriptor.js";

export class ServiceProvider {
    #descriptors: Map<ServiceToken, ServiceDescriptor>;
    #parent?: ServiceProvider;
    #instances = new Map<ServiceToken, unknown>();
    #resolving = new Set<ServiceToken>();

    constructor(descriptors: Map<ServiceToken, ServiceDescriptor>, parent?: ServiceProvider) {
        this.#descriptors = descriptors;
        this.#parent = parent;
    }

    createScope() {
        return new ServiceProvider(this.#descriptors, this);
    }

    resolve<T>(token: ServiceToken<T>): T {
        const descriptor = this.#descriptors.get(token) as ServiceDescriptor<T> | undefined;

        if (!descriptor) {
            throw new Error(`Service not registered for token: ${String(token)}`);
        }

        if (this.#resolving.has(token)) {
            throw new Error(`Circular dependency detected for token: ${String(token)}`);
        }

        this.#resolving.add(token);

        try {
            switch (descriptor.lifetime) {
                case ServiceLifetime.Singleton:
                    return this.#resolveSingleton<T>(descriptor);
                case ServiceLifetime.Transient:
                    return new descriptor.type();
                case ServiceLifetime.Scoped:
                    return this.#resolveScoped<T>(descriptor);
            }
        }
        finally {
            this.#resolving.delete(token);
        }
    }

    #resolveSingleton<T>(descriptor: ServiceDescriptor<T>): T {
        const root = this.#getRootProvider();

        if (!root.#instances.has(descriptor.token)) {
            const instance = new descriptor.type();
            root.#instances.set(descriptor.token, instance);
        }

        return root.#instances.get(descriptor.token) as T;
    }

    #resolveScoped<T>(descriptor: ServiceDescriptor<T>): T {
        if (!this.#instances.has(descriptor.token)) {
            const instance = new descriptor.type();
            this.#instances.set(descriptor.token, instance);
        }

        return this.#instances.get(descriptor.token) as T;
    }

    #getRootProvider(): ServiceProvider {
        let provider = this as ServiceProvider;

        while (provider.#parent) {
            provider = provider.#parent;
        }

        return provider;
    }
}
