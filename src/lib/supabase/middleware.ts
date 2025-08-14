import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

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
    // Try to read the role from your public Profile table via PostgREST.
    // Assumes you have an RLS policy that allows users to select their own profile row.
    const { data: profile, error: profileError } = await supabase
      .from("Profile")
      .select("role")
      .eq("userId", user.id)
      .single();

    // If we couldn't fetch, or role is not ADMIN, redirect away from admin
    const role = profile?.role ?? null;
    const isAdmin = role === "ADMIN";

    if (profileError || !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard"; // send non-admins to main dashboard
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Return the SAME response instance where cookies were set
  return response;
}
