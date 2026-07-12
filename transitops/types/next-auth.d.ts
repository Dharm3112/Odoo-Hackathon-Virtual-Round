import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      roleId: number;
      permissions: Record<string, string>;
      rememberMe?: boolean;
      maxAge?: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    roleId: number;
    permissions: Record<string, string>;
    rememberMe?: boolean;
    maxAge?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    roleId: number;
    permissions: Record<string, string>;
    rememberMe?: boolean;
    maxAge?: number;
  }
}