"use client";

import React from "react";
import { motion } from "motion/react";

type ButtonVariant = "primary" | "outlined" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  animated?: boolean;
}

const SIZE_MAP: Record<ButtonSize, { height: number; padding: string; fontSize: number }> = {
  sm: { height: 36, padding: "8px 16px", fontSize: 14 },
  md: { height: 44, padding: "10px 24px", fontSize: 16 },
  lg: { height: 48, padding: "12px 28px", fontSize: 16 },
};

function getVariantStyles(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case "primary":
      return {
        background: "var(--gradient-primary)",
        color: "var(--primary-foreground)",
        border: "none",
      };
    case "outlined":
      return {
        background: "transparent",
        color: "var(--foreground)",
        border: "1px solid var(--border)",
      };
    case "ghost":
      return {
        background: "transparent",
        color: "var(--muted-foreground)",
        border: "none",
      };
    case "icon":
      return {
        background: "var(--card)",
        border: "1px solid var(--border)",
      };
  }
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  leadingIcon,
  trailingIcon,
  animated = true,
  children,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const sizeConfig = SIZE_MAP[size];
  const variantStyles = getVariantStyles(variant);

  if (variant === "icon") {
    const iconSize = size === "sm" ? 32 : size === "md" ? 36 : 40;
    const baseStyle: React.CSSProperties = {
      ...variantStyles,
      width: iconSize,
      height: iconSize,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      cursor: "pointer",
      ...style,
    };

    if (animated) {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`shrink-0 transition-colors font-body ${className}`}
          style={baseStyle}
          {...(rest as React.ComponentProps<typeof motion.button>)}
        >
          {icon && <span aria-hidden="true">{icon}</span>}
          {!icon && children}
        </motion.button>
      );
    }

    return (
      <button className={`shrink-0 transition-colors cursor-pointer font-body ${className}`} style={baseStyle} {...rest}>
        {icon && <span aria-hidden="true">{icon}</span>}
        {!icon && children}
      </button>
    );
  }

  const baseStyle: React.CSSProperties = {
    ...variantStyles,
    fontSize: sizeConfig.fontSize,
    fontWeight: 600,
    padding: sizeConfig.padding,
    minHeight: sizeConfig.height,
    borderRadius: 8,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-body)",
    ...style,
  };

  if (animated) {
    const hoverProps =
      variant === "primary"
        ? { scale: 1.02, boxShadow: "var(--shadow-button-glow)", filter: "brightness(1.08)" }
        : { scale: 1.02 };

    return (
      <motion.button
        whileHover={hoverProps}
        whileTap={variant === "primary" ? { scale: 0.97, filter: "brightness(0.92)", boxShadow: "none" } : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`font-body ${className}`}
        style={baseStyle}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        {leadingIcon && <span aria-hidden="true">{leadingIcon}</span>}
        {children}
        {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
      </motion.button>
    );
  }

  return (
    <button className={`font-body cursor-pointer ${className}`} style={baseStyle} {...rest}>
      {leadingIcon && <span aria-hidden="true">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
    </button>
  );
}
