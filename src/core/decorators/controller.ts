import MetadataCollection from "../../common/metadata-collection";
import { Constructor } from "../../common/types";
import ControllerBase from "../mvc/controller-base";
import { ControllerMetadata } from "../types";

export default function Controller(path = "/") {
    return (target: Constructor<ControllerBase>, context: ClassDecoratorContext) => {
        const metadata: ControllerMetadata = {
            path,
            target,
        };

        MetadataCollection.set(context.metadata, metadata);
    };
}
