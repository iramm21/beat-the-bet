export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import DashboardChrome from "./_components/layout/DashboardChrome";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardChrome>{children}</DashboardChrome>;
}
