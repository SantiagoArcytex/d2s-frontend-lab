import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  fontSize?: number;
  onClick?: () => void;
  className?: string;
}

export function NavLink({
  href,
  children,
  fontSize = 16,
  onClick,
  className = "",
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-body transition-colors text-muted-foreground hover:text-foreground no-underline ${className}`}
      style={{ fontSize, textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}

export function FooterLink({
  href,
  children,
  className = "",
}: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`font-body transition-colors text-muted-foreground hover:text-primary no-underline ${className}`}
      style={{ fontSize: 14, textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}
