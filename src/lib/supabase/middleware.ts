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
    // Use a service role client to bypass RLS when checking profile role.
    // This prevents authorized admins from being blocked if the RLS policy
    // forbids selecting their profile with the anon key.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error(
        "SUPABASE_SERVICE_ROLE_KEY is not set; cannot verify admin access"
      );
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }

    const supabaseAdmin = createServerClient(supabaseUrl, serviceRoleKey, {
      cookies: {
        // No cookie manipulation is needed for service role queries
        getAll() {
          return [];
        },
        setAll() {
          /* noop */
        },
      },
    });

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("Profile")
      .select("role")
      .eq("userId", user.id)
      .single();

    const role = profile?.role ?? null;
    const isAdmin = role === "ADMIN";

    // If we couldn't fetch, or role is not ADMIN, redirect away from admin
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
