import { ServiceCollection, ServiceDescriptor, ServiceLifeTime } from "@camaro/core";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("ServiceCollection", () => {
    describe("get", () => {
        it("should return the last descriptor", () => {
            // Arrange
            const services = new ServiceCollection();
            const MyService1 = class { };
            const MyService2 = class { };
            const serviceToken = Symbol("MyService");
            const descriptor1 = new ServiceDescriptor(serviceToken, MyService1, ServiceLifeTime.Transient);
            const descriptor2 = new ServiceDescriptor(serviceToken, MyService2, ServiceLifeTime.Transient);
            // Act
            services.add(descriptor1, descriptor2);

            // Assert
            assert.strictEqual(services.get(serviceToken), descriptor2);
        });
    });

    describe("getAll", () => {
        it("should return all descriptors", () => {
            // Arrange
            const services = new ServiceCollection();
            const MyService1 = class { };
            const MyService2 = class { };
            const serviceToken = Symbol("MyService");
            const descriptor1 = new ServiceDescriptor(serviceToken, MyService1, ServiceLifeTime.Transient);
            const descriptor2 = new ServiceDescriptor(serviceToken, MyService2, ServiceLifeTime.Transient);

            // Act
            services.add(descriptor1, descriptor2);

            // Assert
            const descriptors = services.getAll(serviceToken);
            assert.equal(descriptors.length, 2);
            assert.equal(descriptors[0], descriptor1);
        });
    });
});
