import { METHODS } from "node:http";
import TrieNode from "./trie-node.js";

export default class TrieRouter {
    #root = new TrieNode();

    add(path: string, method: string, handler: CallableFunction) {
        if (!METHODS.includes(method.toUpperCase())) {
            throw new Error(`Invalid HTTP method: ${method}`);
        }

        const segments = path.split("/").filter(Boolean);
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

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            node = node.children.get(key)!;
        }

        node.handlers.set(method.toUpperCase(), handler);
    }

    find(path: string, method: string) {
        const segments = path.split("/").filter(Boolean);
        const params: Record<string, string> = {};
        let node = this.#root;

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
}
