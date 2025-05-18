// import { NextResponse } from "next/server";
// import type { NextRequest } from 'next/server'
// // middleware.js
// export function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;
//     if (pathname.startsWith('/sign-in')) {
//         const token = request.cookies.get('token')?.value; // Check if the user has a valid token
//         if (token) {
//             return NextResponse.redirect(new URL('/', request.url));
//         }
//     }
//     return NextResponse.next();
// }
// export const config = {
//     matcher: ["/sign-in/:path*"],

// };

// middleware.ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthenticated = !!token;

    // Redirect unauthenticated users trying to access /playlists
    if (pathname.startsWith('/playlists') && !isAuthenticated) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
    }

    // Redirect authenticated users away from /sign-in
    if (pathname === '/sign-in' && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/playlists/:path*', '/sign-in'],
};
