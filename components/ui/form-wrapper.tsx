import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FormWrapperProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function FormWrapper({
  title,
  description,
  children,
  className,
}: FormWrapperProps) {
  return (
    <Card className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
