import { Protocol } from "./types.js";

class TrieNode {
    /**
     * Children nodes mapped by path segment
     */
    children = new Map<string, TrieNode>();
    /**
     * Handlers associated with this node
     */
    handlers = new Map<string, CallableFunction>();

    /**
     * Parameter name if this node represents a dynamic segment
     */
    paramName?: string;

    constructor(paramName?: string) {
        this.paramName = paramName;
    }
}

export class Router {
    #http = new TrieNode();

    add(protocol: Protocol, segments: string[], method: string, handler: CallableFunction) {
        let node = this.#getRootNode(protocol);

        for (const segment of segments) {
            let key = segment;
            let paramName;

            if (segment.startsWith(":")) {
                key = "*";
                paramName = segment.slice(1);
            }

            if (!node.children.has(key)) {
                const child = new TrieNode(paramName);
                node.children.set(key, child);
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            node = node.children.get(key)!;
        }

        node.handlers.set(method.toUpperCase(), handler);
    }

    find(protocol: Protocol, segments: string[], method: string) {
        const params: Record<string, string> = {};
        let node = this.#getRootNode(protocol);

        for (const segment of segments) {
            if (node.children.has(segment)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                node = node.children.get(segment)!;
            }
            else if (node.children.has("*")) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                node = node.children.get("*")!;
                if (node.paramName) {
                    params[node.paramName] = segment;
                }
            }
            else {
                return null;
            }
        }

        const handler = node.handlers.get(method.toUpperCase());

        return handler ? { handler, params } : null;
    }

    #getRootNode(protocol: Protocol) {
        switch (protocol) {
            case Protocol.HTTP:
                return this.#http;
            default:
                throw new Error(`Unsupported protocol: ${protocol}`);
        }
    }
}
