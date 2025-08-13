import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Start a mutable response
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Edge-safe: read cookies from the incoming request
        getAll() {
          return request.cookies
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        // Edge-safe: write cookies ONLY on the outgoing response
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Keep this immediately after client creation
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Minimal route guard example (feel free to tailor):
  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    !user &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // IMPORTANT: return the same response instance where cookies were set
  return response;
}
