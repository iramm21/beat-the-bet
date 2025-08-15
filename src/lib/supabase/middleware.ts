import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthRoute(pathname: string) {
  // Allow /auth/callback, /auth/logout, etc. Block only the login/register pages.
  return (
    pathname === "/auth" ||
    pathname === "/auth/login" ||
    pathname === "/auth/sign-up" ||
    pathname === "/auth/register"
  );
}

function isAdminRoute(pathname: string) {
  // Any route under /dashboard/admin is considered admin-only
  return (
    pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/")
  );
}

export async function updateSession(request: NextRequest) {
  // Create ONE mutable response and return the same instance (so refreshed cookies are attached)
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
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

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
    url.search = ""; // avoid loop/noisy params
    return NextResponse.redirect(url);
  }

  // 3) Admin gate: only allow users with Profile.role === 'ADMIN'
  if (user && isAdminRoute(pathname)) {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { role: true },
    });
    const isAdmin = profile?.role === "ADMIN";
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Return the SAME response instance where cookies were set
  return response;
}
