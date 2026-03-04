interface OverlineLabelProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function OverlineLabel({
  children,
  color = "var(--muted-foreground)",
  className = "",
  style,
}: OverlineLabelProps) {
  return (
    <span
      className={`font-mono uppercase ${className}`}
      style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
