import assert from "node:assert/strict";
import { describe, it } from "node:test";

import RequestMethod from "@core/http/request-method";
import Router from "@core/http/routing/router";

describe("Router", () => {
    const router = new Router();

    it("should match root path", () => {
        // Arrange
        const handler = () => { };
        // Act
        router.add("/", handler, RequestMethod.GET);
        const matchedRoute = router.match("/", RequestMethod.GET);
        // Assert
        assert.equal(matchedRoute?.handler, handler);
    });

    it("should match static path", () => {
        // Arrange
        const handler = () => { };
        // Act
        router.add("/users", handler, RequestMethod.GET);
        const matchedRoute = router.match("/users", RequestMethod.GET);
        // Assert
        assert.equal(matchedRoute?.handler, handler);
    });

    it("should match dynamic path", () => {
        // Arrange
        const handler = () => { };
        // Act
        router.add("/users/:id(\\d+)", handler, RequestMethod.GET);
        const matchedRoute = router.match("/users/1", RequestMethod.GET);
        // Assert
        assert.equal(matchedRoute?.handler, handler);
        assert.equal(matchedRoute.params.id, "1");
    });
});
