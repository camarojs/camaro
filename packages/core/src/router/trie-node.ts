export class TrieNode {
    /**
     * Children nodes mapped by path segment
     */
    children = new Map<string, TrieNode>();
    /**
     * Handlers associated with this node, mapped by HTTP method
     */
    handlers = new Map<string, CallableFunction>();

    /**
     * Creates a new TrieNode
     * @param paramName Parameter name if this node represents a dynamic segment
     */
    constructor(public paramName?: string) { }
}
