import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/providers/";
import ResponsibleGamblingBanner from "@/components/ui/responsible-gambling-banner";

export const metadata: Metadata = {
  title: "Beat the Bet",
  description: "A betting tracker for NRL enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <ResponsibleGamblingBanner
            position="bottom"
            sticky
            // Optional defaults tailored for AU, replace with your own resources or leave blank
            // helplines={[
            //   { label: "Gambling Help Online (AU)", href: "https://www.gamblinghelponline.org.au/" },
            // ]}
            // learnMoreHref="/responsible-gambling"
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
