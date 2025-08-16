import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect everything except the root ("/"), static files, and API routes
    '/((?!_next|favicon.ico|\\.|^$|api).*)',
  ],
};