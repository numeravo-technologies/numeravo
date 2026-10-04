import Link from "next/link";

const PROJECT_HREF =
  "/construction/project/concrete-slab-equipment-pad";

type BackToProjectButtonProps = {
  compact?: boolean;
};

export default function BackToProjectButton({
  compact = false,
}: BackToProjectButtonProps) {
  return (
    <Link
      href={PROJECT_HREF}
      className={
        compact
          ? "inline-flex items-center justify-center rounded-xl border border-[#F97316]/70 bg-[#2A170D] px-3 py-2 text-xs font-semibold text-[#FDBA74] transition hover:border-[#F97316] hover:bg-[#351B0D] hover:text-white"
          : "inline-flex items-center justify-center rounded-xl border border-[#F97316]/70 bg-[#2A170D] px-5 py-3 font-semibold text-[#FDBA74] transition hover:border-[#F97316] hover:bg-[#351B0D] hover:text-white"
      }
    >
      ← Back to Project
    </Link>
  );
}
