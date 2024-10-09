import ContextStorage from "../common/context-storage";
import Context from "./context";

export default class ControllerBase {
    get request() {
        return this.context.request;
    }

    get response() {
        return this.context.response;
    }

    get context() {
        return ContextStorage.get() as Context;
    }
}
