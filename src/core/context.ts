import { ContextStore } from "../common/types";
import Request from "./request";
import Response from "./response";

export default class Context implements ContextStore {
    #request: Request;
    #response: Response;
    [key: PropertyKey]: unknown;

    get request() {
        return this.#request;
    }

    get response() {
        return this.#response;
    }

    constructor(request: Request, response: Response) {
        this.#request = request;
        this.#response = response;
    }
}
