import type { ReactNode } from "react";

import ConstructionTopSearch from "@/components/calculators/ConstructionTopSearch";
import ProjectWorkflowNavigator from "@/components/projects/ProjectWorkflowNavigator";

type ConstructionLayoutProps = {
  children: ReactNode;
};

export default function ConstructionLayout({
  children,
}: ConstructionLayoutProps) {
  return (
    <>
      <ProjectWorkflowNavigator />
      <ConstructionTopSearch />
      {children}
    </>
  );
}
