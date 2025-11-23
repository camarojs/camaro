import assert from "node:assert";
import { describe, it } from "node:test";
import { Router } from "../../src/router.js";

// Helper to create a no-op handler
const noop = () => { /* empty */ };

void describe(Router.name, () => {
    void it("adds and finds a static route handler", () => {
        const router = new Router();
        const handler = () => "ok";
        router.add("/users", "GET", handler);
        const match = router.find("/users", "GET");
        assert.ok(match, "Expected to find route");
        const m = match as { handler: CallableFunction; params: Record<string, string> };
        assert.strictEqual(m.handler, handler, "Handler should match");
        assert.deepStrictEqual(m.params, {}, "Params should be empty for static path");
    });

    void it("adds and finds a param route handler with params extracted", () => {
        const router = new Router();
        const handler = () => "user";
        router.add("/users/:id", "GET", handler);
        const match = router.find("/users/123", "GET");
        assert.ok(match, "Expected to find param route");
        const m = match as { handler: CallableFunction; params: Record<string, string> };
        assert.strictEqual(m.handler, handler);
        assert.deepStrictEqual(m.params, { id: "123" });
    });

    void it("adds and finds a param route handler with params extracted", () => {
        const router = new Router();
        const handler = () => "user";
        router.add("/users/:id", "GET", handler);
        const match = router.find("/users/123", "GET");
        assert.ok(match, "Expected to find param route");
        const m = match as { handler: CallableFunction; params: Record<string, string> };
        assert.strictEqual(m.handler, handler);
        assert.deepStrictEqual(m.params, { id: "123" });
    });

    void it("static segment takes precedence over param segment", () => {
        const router = new Router();
        const listHandler = () => "list";
        const userHandler = () => "user";
        router.add("/users/list", "GET", listHandler);
        router.add("/users/:id", "GET", userHandler);

        const staticMatch = router.find("/users/list", "GET");
        assert.ok(staticMatch, "Expected static route match");
        const s = staticMatch as { handler: CallableFunction; params: Record<string, string> };
        assert.strictEqual(s.handler, listHandler, "Should match static route handler, not param route");
        assert.deepStrictEqual(s.params, {}, "Static route should not yield params");

        const paramMatch = router.find("/users/456", "GET");
        assert.ok(paramMatch, "Expected param route match");
        const p = paramMatch as { handler: CallableFunction; params: Record<string, string> };
        assert.strictEqual(p.handler, userHandler);
        assert.deepStrictEqual(p.params, { id: "456" });
    });

    void it("returns null for non-existent route", () => {
        const router = new Router();
        router.add("/users", "GET", noop);
        assert.strictEqual(router.find("/unknown", "GET"), null);
    });

    void it("returns null for existing route with different method", () => {
        const router = new Router();
        router.add("/users", "GET", noop);
        assert.strictEqual(router.find("/users", "POST"), null);
    });

    void it("method match is case-insensitive (add lower, find upper)", () => {
        const router = new Router();
        const handler = () => "ok";
        router.add("/ping", "get", handler);
        const match = router.find("/ping", "GET");
        assert.ok(match, "Expected match with different method case");
        const m = match as { handler: CallableFunction; params: Record<string, string> };
        assert.strictEqual(m.handler, handler);
    });

    void it("add throws for invalid HTTP method", () => {
        const router = new Router();
        assert.throws(() => {
            router.add("/x", "FOO", noop);
        }, /Invalid HTTP method: FOO/);
    });
});
