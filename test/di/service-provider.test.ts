import { ServiceLifeTime, ServiceProvider } from "@camaro/core";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("ServiceProvider", () => {
    it("should resolve a singleton service", () => {
        const Service = class { };
        const provider = new ServiceProvider();

        provider.register("service", Service, ServiceLifeTime.Singleton);

        const service1 = provider.resolve("service");
        const service2 = provider.resolve("service");

        assert.equal(service1, service2);
    });

    it("should resolve a transient service", () => {
        const Service = class { };
        const provider = new ServiceProvider();

        provider.register("service", Service, ServiceLifeTime.Transient);

        const service1 = provider.resolve("service");
        const service2 = provider.resolve("service");

        assert.notEqual(service1, service2);
    });

    it("should resolve all services", () => {
        const Service = class { };
        const provider = new ServiceProvider();

        provider.register("service", Service, ServiceLifeTime.Singleton);
        provider.register("service", Service, ServiceLifeTime.Singleton);

        const services = provider.resolveAll("service");

        assert.equal(services.length, 2);
        assert.notEqual(services[0], services[1]);
        assert.ok(services[0] instanceof Service);
        assert.ok(services[1] instanceof Service);
    });

    it("should throw an error when no service is found", () => {
        const provider = new ServiceProvider();

        assert.throws(() => {
            provider.resolve("service");
        });

        assert.throws(() => {
            provider.resolveAll("service");
        });
    });
});
