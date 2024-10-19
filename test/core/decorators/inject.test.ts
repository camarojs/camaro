import ServiceLifetime from "@common/di/service-lifetime";
import ServiceProvider from "@common/di/service-provider";
import Inject, { InjectAll } from "@core/decorators/inject";

import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("Inject", () => {
    it("should throw an error if the decorator is not applied to a accessor", () => {
        assert.throws(() => {
            Inject("token")({ get: () => { }, set: () => { } }, { kind: "class" } as DecoratorContext);
        });
    });
});

describe("InjectAll", () => {
    // Arrange
    class MyService {
        test() {
            return MyService.name;
        }
    }

    // Act
    ServiceProvider.instance.register(MyService, MyService, ServiceLifetime.Transient);
    const accessor = InjectAll(MyService)({ get: () => { }, set: () => { } }, { kind: "accessor" } as DecoratorContext);

    // Assert
    assert.ok(Array.isArray(accessor.get?.()));
});
