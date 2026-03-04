import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  color?: string;
  className?: string;
}

export function StarRating({
  rating,
  size = 16,
  color = "var(--gold)",
  className = "",
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{
            width: size,
            height: size,
            color: s <= rating ? color : "var(--text-muted)",
            filter: s <= rating ? `drop-shadow(0 0 2px ${color})` : "none",
          }}
          fill={s <= rating ? color : "none"}
        />
      ))}
    </div>
  );
}
