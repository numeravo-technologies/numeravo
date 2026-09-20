import type { ReactNode } from "react";

type CategoryTheme = "construction" | "business" | "finance";

type CategoryPageShellProps = {
  children: ReactNode;
  theme: CategoryTheme;
};

const themeStyles: Record<
  CategoryTheme,
  {
    grid: string;
    glow: string;
  }
> = {
  construction: {
    grid: "rgba(249,115,22,0.075)",
    glow: "rgba(249,115,22,0.14)",
  },
  business: {
    grid: "rgba(6,182,212,0.075)",
    glow: "rgba(6,182,212,0.14)",
  },
  finance: {
    grid: "rgba(34,197,94,0.075)",
    glow: "rgba(34,197,94,0.14)",
  },
};

export default function CategoryPageShell({
  children,
  theme,
}: CategoryPageShellProps) {
  const styles = themeStyles[theme];

  return (
    <main
      className="min-h-screen bg-[#0B0F19] px-6 py-16 text-white"
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
