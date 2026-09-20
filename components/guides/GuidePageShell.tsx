import type { ReactNode } from "react";

type GuidePageShellProps = {
  children: ReactNode;
};

export default function GuidePageShell({
  children,
}: GuidePageShellProps) {
  return (
    <main className="min-h-screen bg-[#0B0F19] px-6 py-16 text-white">
      {children}
    </main>
  );
}
