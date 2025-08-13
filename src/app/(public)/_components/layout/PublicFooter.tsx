import Link from "next/link";
import { Github, Twitter, Linkedin, Youtube, Shield } from "lucide-react";
import NewsletterForm from "@/app/(public)/_components/NewsletterForm";

const nav = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Guides", href: "/guides" },
    { label: "API Status", href: "/status" },
    { label: "Community", href: "/community" },
    { label: "Security", href: "/security" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Cookie Policy", href: "/legal/cookies" },
    { label: "Data Processing", href: "/legal/dpa" },
  ],
};

function Column({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand + blurb + social */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-bold">
              BTB
            </span>
            <span className="text-base font-semibold tracking-tight">
              Beat the Bet
            </span>
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">
            A smarter way to plan and track bets. Insights, EV/Kelly guidance,
            and bankroll analytics.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Link
              aria-label="X (Twitter)"
              href="https://twitter.com"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link
              aria-label="GitHub"
              href="https://github.com"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              aria-label="LinkedIn"
              href="https://www.linkedin.com"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link
              aria-label="YouTube"
              href="https://youtube.com"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Youtube className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Newsletter (client form) */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Stay in the loop</h4>
          <p className="text-sm text-muted-foreground">
            Product updates, new models, and tips. No spam—unsubscribe anytime.
          </p>
          <NewsletterForm />
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>We care about your data privacy.</span>
          </p>
        </div>

        {/* Link columns */}
        <Column title="Product" items={nav.product} />
        <div className="grid grid-cols-2 gap-10">
          <Column title="Company" items={nav.company} />
          <Column title="Resources" items={nav.resources} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            © {year} Beat the Bet. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link
              href="/legal/privacy"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/legal/cookies"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Cookies
            </Link>
            <Link
              href="/status"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
