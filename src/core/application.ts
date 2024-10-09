import { RequestListener, Server, ServerOptions } from "http";
import { Stream } from "stream";
import Context from "./context";
import Request from "./request";
import Response from "./response";
import { ComposedMiddleware, Middleware, Next } from "./types";

export default class Application {
    #middlewares: Middleware[] = [];

    use(middleware: Middleware) {
        if (typeof middleware !== "function") {
            throw new TypeError("Middleware must be a function");
        }

        this.#middlewares.push(middleware);
    }

    run(port = 80) {
        const options: ServerOptions = { IncomingMessage: Request, ServerResponse: Response };
        const server = new Server(options, this.#createListener());

        server.listen(port);
    }

    #createListener(): RequestListener<typeof Request, typeof Response> {
        const middleware = this.#composeMiddlewares(this.#middlewares);

        return (request: Request, response: Response) => {
            const context = new Context(request, response);

            this.#handleRequest(context, middleware);
        };
    }

    #composeMiddlewares(middlewares: Middleware[]) {
        return async (context: Context, next?: Next) => {
            let calledIndex = -1;

            const dispatch = async (index: number): Promise<void> => {
                if (index <= calledIndex) {
                    throw new Error("next() called multiple times.");
                }

                calledIndex = index;

                const currentMiddleware = index === middlewares.length ? next : middlewares[index];
                const result = currentMiddleware?.(context, dispatch.bind(null, index + 1));

                return Promise.resolve(result);
            };

            return dispatch(0);
        };
    }

    #handleRequest(context: Context, middleware: ComposedMiddleware): void {
        const handleResponse = () => {
            this.#handleResponse(context);
        };

        const handleError = (error: unknown) => {
            console.error(error);
        };

        middleware(context).then(handleResponse).catch(handleError);
    }

    #handleResponse(context: Context): void {
        const response = context.response;

        if (Buffer.isBuffer(response.data) || typeof response.data === "string") {
            response.end(response.data);
        }

        if (response.data instanceof Stream) {
            response.data.pipe(response);
        }

        response.end(JSON.stringify(response.data));
    }
}
