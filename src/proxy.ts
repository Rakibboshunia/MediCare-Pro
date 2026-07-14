import { withAuth } from "next-auth/middleware";

const middleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export default function proxy(req: any, event: any) {
  return middleware(req, event);
}

export const config = {
  matcher: [
    "/((?!login|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
