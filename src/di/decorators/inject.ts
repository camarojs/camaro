import ServiceProvider from "../service-provider";
import { ServiceToken } from "../types";

export function createInjectDecorator(token: ServiceToken, resolveAllServices?: boolean) {
    return <TThis, TValue>(
        _target: ClassAccessorDecoratorTarget<TThis, TValue>,
        context: DecoratorContext,
    ): ClassAccessorDecoratorResult<TThis, TValue | TValue[]> => {
        const get = resolveAllServices
            ? () => ServiceProvider.instance.resolveAll(token) as TValue[]
            : () => ServiceProvider.instance.resolve(token) as TValue;

        switch (context.kind) {
            case "accessor":
                return { get };

            default:
                throw new Error("The decorator can only be used on class accessors.");
        }
    };
}

export function InjectAll(token: ServiceToken) {
    return createInjectDecorator(token, true);
}

export default function Inject(token: ServiceToken) {
    return createInjectDecorator(token);
}
