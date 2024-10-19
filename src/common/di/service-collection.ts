import { ServiceToken } from "../types";
import ServiceDescriptor from "./service-descriptor";

export default class ServiceCollection {
    #entities = new Map<ServiceToken, ServiceDescriptor[]>();

    get(serviceToken: ServiceToken) {
        return this.#entities.get(serviceToken)?.at(-1) ?? null;
    }

    getAll(serviceToken: ServiceToken) {
        return this.#entities.get(serviceToken) ?? [];
    }

    add(...descriptors: ServiceDescriptor[]) {
        descriptors.forEach((descriptor) => {
            const descriptors = this.#entities.get(descriptor.serviceToken) ?? [];

            descriptors.push(descriptor);

            this.#entities.set(descriptor.serviceToken, descriptors);
        });
    }
}
