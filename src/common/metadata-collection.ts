export default class MetadataCollection {
    #metadata = new WeakMap<DecoratorMetadata, unknown>();

    get(metadata: DecoratorMetadata) {
        return this.#metadata.get(metadata);
    }

    set(metadata: DecoratorMetadata, value: unknown) {
        return this.#metadata.set(metadata, value);
    }

    static #instance = new MetadataCollection();

    static get(metadata: DecoratorMetadata) {
        return this.#instance.get(metadata);
    }

    static set(metadata: DecoratorMetadata, value: unknown) {
        return this.#instance.set(metadata, value);
    }
}
