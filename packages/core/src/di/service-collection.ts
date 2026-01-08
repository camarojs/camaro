import { ServiceLifetime, ServiceLifetimeNames, ServiceToken } from "../types.js";
import { ServiceDescriptor } from "./service-descriptor.js";
import { ServiceProvider } from "./service-provider.js";
import { resolveTokenName } from "./utils.js";

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

    addSingleton<T>(serviceToken: ServiceToken<T>, serviceType: new () => T, dependencies: ServiceToken[] = []) {
        const descriptor = new ServiceDescriptor(serviceToken, serviceType, ServiceLifetime.Singleton, dependencies);
        return this.add(descriptor);
    }

    addTransient<T>(serviceToken: ServiceToken<T>, serviceType: new () => T, dependencies: ServiceToken[] = []) {
        const descriptor = new ServiceDescriptor(serviceToken, serviceType, ServiceLifetime.Transient, dependencies);
        return this.add(descriptor);
    }

    addScoped<T>(serviceToken: ServiceToken<T>, serviceType: new () => T, dependencies: ServiceToken[] = []) {
        const descriptor = new ServiceDescriptor(serviceToken, serviceType, ServiceLifetime.Scoped, dependencies);
        return this.add(descriptor);
    }

    buildProvider() {
        this.#detectCycles();
        this.#detectLifetimeViolations();

        return new ServiceProvider(this.#descriptors);
    }

    #detectCycles() {
        const visiting = new Set<ServiceToken>();
        const visited = new Set<ServiceToken>();

        const visit = (token: ServiceToken, stack: ServiceToken[]) => {
            if (visited.has(token)) {
                return;
            }

            if (visiting.has(token)) {
                const cycleStartIndex = stack.indexOf(token);
                const cycle = stack.slice(cycleStartIndex).concat(token);
                throw new Error(`Cyclic dependency detected: ${cycle.map(t => resolveTokenName(t)).join(" -> ")
                }. Break the cycle by introducing an abstraction or reordering dependencies.`);
            }

            visiting.add(token);
            stack.push(token);

            const descriptor = this.#descriptors.get(token);
            if (descriptor) {
                for (const depToken of descriptor.dependencies) {
                    visit(depToken, stack);
                }
            }

            visiting.delete(token);
            visited.add(token);
            stack.pop();
        };

        for (const token of this.#descriptors.keys()) {
            visit(token, []);
        }
    }

    #detectLifetimeViolations() {
        const visit = (current: ServiceDescriptor, stack: ServiceDescriptor[]) => {
            stack.push(current);

            for (const token of current.dependencies) {
                const dep = this.#descriptors.get(token);
                if (!dep) {
                    continue;
                };

                if (current.lifetime > dep.lifetime) {
                    const chain = [...stack, dep];
                    const chainStr = chain
                        .map(x => `${String(x.token)}[${ServiceLifetimeNames[x.lifetime]}]`)
                        .join(" -> ");

                    throw new Error(
                        `Invalid lifetime dependency detected:\n`
                        + `${String(current.token)}(${ServiceLifetimeNames[current.lifetime]}) `
                        + `depends on ${String(dep.token)}(${ServiceLifetimeNames[dep.lifetime]})\n`
                        + `Dependency chain: ${chainStr}`,
                    );
                }

                if (!stack.includes(dep)) {
                    visit(dep, stack);
                }
            }

            stack.pop();
        };

        for (const descriptor of this.#descriptors.values()) {
            const stack: ServiceDescriptor[] = [];
            visit(descriptor, stack);
        }
    }
}
