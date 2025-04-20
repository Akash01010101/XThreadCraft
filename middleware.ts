import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

// Configure the middleware to protect the /thread, /account, /analytics and all API routes
export const config = {
  matcher: [
    '/thread',
    '/account',
    '/analytics',
    '/api/:path*', // Protect all API routes
  ],
};
