import { withAuth } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/api/auth")) {
        return true;
      }

      if (pathname === "/login") {
        return !token;
      }

      return Boolean(token);
    },
  },
});
