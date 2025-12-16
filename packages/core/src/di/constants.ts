export enum ServiceLifetime {
    Transient = 0,
    Scoped = 1,
    Singleton = 2,
}

export const DI_DEPENDENCIES_KEY = Symbol("di:dependencies");
