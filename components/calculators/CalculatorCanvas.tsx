import type { ReactNode } from "react";

export type CalculatorTheme = "construction" | "business" | "finance";

type CalculatorCanvasProps = {
  children: ReactNode;
  theme?: CalculatorTheme;
  className?: string;
};

const themeStyles: Record<
  CalculatorTheme,
  {
    grid: string;
    glow: string;
  }
> = {
  construction: {
    grid: "rgba(249,115,22,0.035)",
    glow: "rgba(249,115,22,0.10)",
  },
  business: {
    grid: "rgba(6,182,212,0.035)",
    glow: "rgba(6,182,212,0.10)",
  },
  finance: {
    grid: "rgba(34,197,94,0.035)",
    glow: "rgba(34,197,94,0.10)",
  },
};

export default function CalculatorCanvas({
  children,
  theme = "construction",
  className = "",
}: CalculatorCanvasProps) {
  const styles = themeStyles[theme];

  return (
    <main
      className={`min-h-screen bg-[#090D14] text-white ${className}`.trim()}
      style={{
        backgroundImage: `
          linear-gradient(${styles.grid} 1px, transparent 1px),
          linear-gradient(90deg, ${styles.grid} 1px, transparent 1px),
          radial-gradient(circle at 50% 0%, ${styles.glow}, transparent 34rem)
        `,
        backgroundSize: "32px 32px, 32px 32px, auto",
      }}
    >
      {children}
    </main>
  );
}
