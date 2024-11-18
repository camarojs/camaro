import { MatchedRoute } from "../../types";
import RequestMethod from "../request-method";
import RouteTrieNode from "./route-trie-node";

export default class Router {
    #root = new RouteTrieNode();

    add(path: string, handler: CallableFunction, method: RequestMethod) {
        let currentNode = this.#root;

        for (const segment of path.split("/")) {
            if (segment === "") {
                continue;
            }

            currentNode = this.#parseNode(currentNode, segment);
        }

        currentNode.setHandler(method, handler);

        if (method === RequestMethod.GET) {
            currentNode.setHandler(RequestMethod.HEAD, handler);
        }

        return this;
    }

    match(path: string, method: RequestMethod): MatchedRoute | undefined {
        const segments = path.split("/").filter(segment => segment !== "");
        const params: Record<string, string> = {};
        let currentNode: RouteTrieNode | undefined;

        for (const segment of segments) {
            const node = this.#findNode(currentNode ?? this.#root, segment);

            if (!node) {
                return;
            }

            if (node.name) {
                params[node.name] = segment;
            }

            currentNode = node;
        }

        currentNode = currentNode ?? this.#root;

        return {
            handler: currentNode.getHandler(method),
            params,
        };
    }

    #parseNode(parent: RouteTrieNode, segment: string) {
        let node: RouteTrieNode | undefined;

        if (segment.startsWith(":")) {
            let name: string | undefined;
            let regex: RegExp | undefined;

            const source = segment.replace(/^:\w+\b/, (matched) => {
                name = matched.slice(1);
                return "";
            });

            if (source) {
                regex = new RegExp(source);
            }

            node = parent.varyChildren
                .find(child => (!child.regex && !regex) || (child.regex?.source === regex?.source));

            if (!node) {
                node = new RouteTrieNode();
                node.regex = regex;
                node.name = name;
                node.pattern = segment;

                parent.varyChildren.push(node);
            }
        }
        else {
            node = parent.get(segment) ?? new RouteTrieNode();
            parent.set(segment, node);
        }

        return node;
    }

    #findNode(parent: RouteTrieNode, segment: string): RouteTrieNode | undefined {
        let node = parent.get(segment);

        if (!node) {
            node = parent.varyChildren.find(child => !child.regex || child.regex.test(segment));
        }

        return node;
    }
}
