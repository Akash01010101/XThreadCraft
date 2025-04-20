import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

// Configure the middleware to protect the /thread, /account, /analytics and all API routes except /api/schedule
export const config = {
  matcher: [
    '/thread',
    '/account',
    '/analytics',
    '/((?!api/schedule).*)', // Exclude /api/schedule from protection
  ],
};
