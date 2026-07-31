import type http from "node:http";

export function sendJson(
    response: http.ServerResponse,
    status: number,
    body: object,
): void {
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify(body));
}
