import RequestMethod from "../request-method";

export default class RouteTrieNode {
    #handler = new Map<RequestMethod, CallableFunction>();
    #children = new Map<string, RouteTrieNode>();
    varyChildren: RouteTrieNode[] = [];

    name?: string;
    pattern?: string;
    regex?: RegExp;

    setHandler(method: RequestMethod, handler: CallableFunction) {
        this.#handler.set(method, handler);
    }

    getHandler(method: RequestMethod) {
        return this.#handler.get(method);
    }

    get(segment: string) {
        return this.#children.get(segment);
    }

    set(segment: string, node: RouteTrieNode) {
        this.#children.set(segment, node);
    }
}
