/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
    #root = new TrieNode();

    add(segments: string[], method: string, handler: CallableFunction) {
        let node = this.#root;

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

            node = node.children.get(key)!;
        }

        node.handlers.set(method.toUpperCase(), handler);
    }

    find(segments: string[], method: string) {
        const params: Record<string, string> = {};
        let node = this.#root;

        for (const segment of segments) {
            if (node.children.has(segment)) {
                node = node.children.get(segment)!;
            }
            else if (node.children.has("*")) {
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
}
