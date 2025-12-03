import { ServiceToken } from "../types.js";

export const resolveTokenName = (token: ServiceToken) => {
    if (typeof token === "function" && token.name) {
        return token.name;
    }

    return String(token);
};
