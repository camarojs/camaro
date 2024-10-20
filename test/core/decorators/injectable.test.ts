import ServiceLifeTime from "@common/di/service-lifetime";
import ServiceProvider from "@common/di/service-provider";
import { Constructor } from "@common/types";
import Injectable from "@core/decorators/injectable";

import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("Injectable", () => {
    it("should register the service with custom options", () => {
        // Arrange
        @Injectable({ lifetime: ServiceLifeTime.Transient })
        class MyService { }
        // Act
        const service = ServiceProvider.resolve(MyService);

        // Assert
        assert.ok(service instanceof MyService);
    });

    it("should throw an error if the decorator is not applied to a class", () => {
        assert.throws(() => {
            Injectable()({} as Constructor, {} as DecoratorContext);
        });
    });
});
