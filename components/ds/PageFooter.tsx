import { FooterLink } from "./NavLink";
import { OverlineLabel } from "./OverlineLabel";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Browse deals", href: "/marketplace" },
      { label: "Categories", href: "/marketplace" },
      { label: "Featured", href: "/marketplace" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Creators",
    links: [
      { label: "Sell your app", href: "#" },
      { label: "Creator standards", href: "#" },
      { label: "Creator FAQ", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Security", href: "#" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Refund policy", href: "#" },
    ],
  },
];

export function PageFooter() {
  return (
    <footer className="bg-secondary" style={{ padding: "48px 24px" }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 mt-0">
                <OverlineLabel style={{ fontWeight: 700, letterSpacing: '0.12em', color: 'var(--foreground)' }}>{col.title}</OverlineLabel>
              </p>
              <ul className="list-none m-0 p-0">
                {col.links.map((link) => (
                  <li key={link.label} className="mb-2">
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6">
          <p className="font-body text-[13px] text-muted-foreground text-center m-0" style={{ fontWeight: 400, lineHeight: 1.4, letterSpacing: "0.01em" }}>
            &copy; 2026 VCI — Vibe Coding Incubator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
