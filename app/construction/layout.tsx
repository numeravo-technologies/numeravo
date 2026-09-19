import type { ReactNode } from "react";

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
      {children}
    </>
  );
}
