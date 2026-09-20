import type { ReactNode } from "react";

type CategoryPageShellProps = {
  children: ReactNode;
};

export default function CategoryPageShell({
  children,
}: CategoryPageShellProps) {
  return (
    <main className="min-h-screen bg-[#0B0F19] px-6 py-16 text-white">
      {children}
    </main>
  );
}
