import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAdmin = token?.role === "ADMIN";
        const isClient = token?.role === "CLIENT" || isAdmin;
        const isApproved = token?.approved;

        const path = req.nextUrl.pathname;

        // Admin Routes
        if (path.startsWith("/admin")) {
            if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));
            if (!isAdmin) return NextResponse.redirect(new URL("/", req.url));
        }

        // Client Routes (e.g. cart, profile)
        if (path.startsWith("/cart") || path.startsWith("/profile")) {
            if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));
        }

        // Logic for "Approved" users to see prices is handled in components, 
        // but maybe some routes are strict?
        // For now, middleware mainly protects Admin and Cart.
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/cart/:path*", "/profile/:path*"],
};
