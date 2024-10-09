import { ServerResponse } from "node:http";
import Request from "./request";

export default class Response<T extends Request = Request> extends ServerResponse<T> {
    data?: unknown;
}
