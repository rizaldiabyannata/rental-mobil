import { NextResponse } from "next/server";
import { getCurrentUser } from "./jwt";

// Middleware untuk proteksi route admin
export function withAuth(handler) {
  return async function authHandler(request) {
    try {
      const user = getCurrentUser();

      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized - No token provided" },
          { status: 401 }
        );
      }

      if (user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 }
        );
      }

      // Attach user to request for use in handler
      request.user = user;
      return handler(request);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

// Middleware untuk route yang hanya butuh login (tidak harus admin)
export function withLogin(handler) {
  return async function loginHandler(request) {
    try {
      const user = getCurrentUser();

      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized - Login required" },
          { status: 401 }
        );
      }

      // Attach user to request for use in handler
      request.user = user;
      return handler(request);
    } catch (error) {
      console.error("Login middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

const isDevelopment = process.env.NODE_ENV === "development";

export const maybeWithAuth = isDevelopment ? (handler) => handler : withAuth;
export const maybeWithLogin = isDevelopment ? (handler) => handler : withLogin;
