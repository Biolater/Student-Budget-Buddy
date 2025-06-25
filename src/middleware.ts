// middleware.ts

import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, redirectToSignIn } = await auth();

  // If user is logged in
  if (userId) {
    // Redirect from home to dashboard
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Redirect from sign-in/sign-up to dashboard (logged-in users shouldn't access auth pages)
    if (isAuthRoute(request)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Allow access to all other routes when logged in
    return NextResponse.next();
  }

  // If user is not logged in
  // Allow access to public routes (home, api) and auth routes (sign-in, sign-up)
  if (isPublicRoute(request) || isAuthRoute(request)) {
    return NextResponse.next();
  }

  // Redirect to sign-in for protected routes when not logged in
  return redirectToSignIn({
    returnBackUrl: request.url,
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api(.*)",
  ],
};
