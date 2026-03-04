interface WindowDotsProps {
  size?: number;
  className?: string;
}

export function WindowDots({ size = 10, className = "" }: WindowDotsProps) {
  return (
    <div className={`flex ${className}`} style={{ gap: size * 0.6 }}>
      <div className="rounded-full bg-destructive" style={{ width: size, height: size }} />
      <div className="rounded-full bg-warning" style={{ width: size, height: size }} />
      <div className="rounded-full bg-success" style={{ width: size, height: size }} />
    </div>
  );
}
