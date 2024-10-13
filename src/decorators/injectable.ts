import { Constructor } from "../common/types";
import ServiceLifeTime from "../di/service-lifetime";
import ServiceProvider from "../di/service-provider";
import { InjectableOptions } from "../di/types";

export default function Injectable(options?: InjectableOptions) {
    return (target: Constructor, context: DecoratorContext) => {
        if (context.kind !== "class") {
            throw new Error("The Injectable decorator can only be applied to classes");
        }

        const serviceToken = options?.serviceToken ?? target;
        const lifetime = options?.lifetime ?? ServiceLifeTime.Singleton;

        ServiceProvider.instance.register(serviceToken, target, lifetime);
    };
}
