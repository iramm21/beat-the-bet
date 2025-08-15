// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keep this to handle auth route redirects nicely
function isAuthRoute(pathname: string) {
  return (
    pathname === "/auth" ||
    pathname === "/auth/login" ||
    pathname === "/auth/sign-up" ||
    pathname === "/auth/register"
  );
}

// NOTE: We intentionally do NOT import prisma here. Middleware runs on Edge.

export async function updateSession(request: NextRequest) {
  // Always return the SAME NextResponse instance so refreshed cookies stick
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set"
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies
          .getAll()
          .map(({ name, value }) => ({ name, value }));
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Validate/refresh session and write any updated cookies onto `response`
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  const { pathname, searchParams } = request.nextUrl;

  // 1) Gate protected routes for unauthenticated users
  if (pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set(
      "redirectTo",
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    );
    return NextResponse.redirect(url);
  }

  // 2) Block auth pages for authenticated users
  if (user && isAuthRoute(pathname)) {
    const url = request.nextUrl.clone();
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    url.pathname =
      redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ✅ Admin check removed from middleware (moved to Node layout)
  return response;
}
