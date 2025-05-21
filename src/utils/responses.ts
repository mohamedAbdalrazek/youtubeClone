export function unauthorized(message: string) {
    return Response.json({ ok: false, message }, { status: 401 });
}

export function forbidden(message: string) {
    return Response.json({ ok: false, message }, { status: 403 });
}
export function badRequest(message: string) {
    return Response.json({ ok: false, message }, { status: 400 });
}

export function internalServerError(message: string = "Internal Server Error") {
    return Response.json({ ok: false, message }, { status: 500 });
}

export function notFound(message: string) {
    return Response.json({ ok: false, message }, { status: 404 });
}