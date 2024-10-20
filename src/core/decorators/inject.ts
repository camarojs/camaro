import ServiceProvider from "../../common/di/service-provider";
import { ServiceToken } from "../../common/types";

export function createInjectDecorator(token: ServiceToken, resolveAllServices?: boolean) {
    return <TThis, TValue>(
        _target: ClassAccessorDecoratorTarget<TThis, TValue>,
        context: DecoratorContext,
    ): ClassAccessorDecoratorResult<TThis, TValue | TValue[]> => {
        const get = resolveAllServices
            ? () => ServiceProvider.resolveAll(token) as TValue[]
            : () => ServiceProvider.resolve(token) as TValue;

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
