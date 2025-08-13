import ClientProviders from "./client-providers";
import { CurrentUserProvider } from "./current-user-context";
import { getCurrentProfile } from "@/features/profile/lib/get-current-profile";

/**
 * Server component: fetches current profile once per request,
 * then renders client providers (theme) + exposes profile via context.
 */
export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <CurrentUserProvider value={{ profile }}>
      <ClientProviders>{children}</ClientProviders>
    </CurrentUserProvider>
  );
}
