import Whoa from "../structures/Whoa";

export function isDev(client: Whoa, userId: string) {
    return client.config.developers.includes(userId);
}
