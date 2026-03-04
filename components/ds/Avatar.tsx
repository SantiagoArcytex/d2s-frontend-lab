type AvatarSize = "xs" | "sm" | "md" | "lg";

const SIZE_MAP: Record<AvatarSize, { outer: number; fontSize: number }> = {
  xs: { outer: 24, fontSize: 10 },
  sm: { outer: 28, fontSize: 11 },
  md: { outer: 36, fontSize: 13 },
  lg: { outer: 56, fontSize: 20 },
};

const GRADIENTS = [
  "linear-gradient(135deg, var(--primary), var(--info))",
  "linear-gradient(135deg, var(--warning), var(--gold))",
  "linear-gradient(135deg, var(--violet), var(--primary))",
  "linear-gradient(135deg, var(--destructive), var(--warning))",
  "linear-gradient(135deg, var(--success), var(--primary))",
];

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  gradientIndex?: number;
  gradient?: string;
  className?: string;
}

export function Avatar({
  initials,
  size = "md",
  gradientIndex = 0,
  gradient,
  className = "",
}: AvatarProps) {
  const config = SIZE_MAP[size];
  const bg = gradient || GRADIENTS[gradientIndex % GRADIENTS.length];

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: config.outer,
        height: config.outer,
        background: bg,
      }}
    >
      <span className="font-body text-white" style={{ fontSize: config.fontSize, fontWeight: 600 }}>
        {initials}
      </span>
    </div>
  );
}
