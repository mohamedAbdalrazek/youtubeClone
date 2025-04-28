import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'
// middleware.js
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/sign-in')) {
        const token = request.cookies.get('token')?.value; // Check if the user has a valid token
        if (token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/sign-in/:path*"],

};