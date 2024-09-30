import { Constructor, Injectable, ServiceLifeTime, ServiceProvider } from "@camaro/core";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("Injectable", () => {
    it("should register the service with custom options", () => {
        // Arrange
        @Injectable({ lifetime: ServiceLifeTime.Transient })
        class MyService { }
        // Act
        const service = ServiceProvider.instance.resolve(MyService);

        // Assert
        assert.ok(service instanceof MyService);
    });

    it("should throw an error if the decorator is not applied to a class", () => {
        assert.throws(() => {
            Injectable()({} as Constructor, {} as DecoratorContext);
        });
    });
});
