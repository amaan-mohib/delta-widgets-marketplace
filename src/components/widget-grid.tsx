import { cn } from "@/lib/tiptap-utils";
import React, { PropsWithChildren } from "react";

interface WidgetGridProps extends PropsWithChildren {
  className?: string;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ children, className }) => {
  return (
    <div
      className={cn("grid gap-3", className)}
      style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
      {children}
    </div>
  );
};

export default WidgetGrid;
