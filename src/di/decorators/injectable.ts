import { Constructor } from "../../common/types";
import ServiceLifeTime from "../service-lifetime";
import ServiceProvider from "../service-provider";
import { InjectableOptions } from "../types";

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
