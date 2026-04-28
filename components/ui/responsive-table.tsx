import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { TableEmptyState } from "@/components/ui/table";

type ResponsiveTableProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  filters?: ReactNode;
  hasData: boolean;
  desktopScrollClassName?: string;
  desktopContent: ReactNode;
  mobileContent: ReactNode;
  emptyState: ReactNode;
};

export function ResponsiveTable({
  eyebrow,
  title,
  description,
  primaryAction,
  filters,
  hasData,
  desktopScrollClassName,
  desktopContent,
  mobileContent,
  emptyState,
}: ResponsiveTableProps) {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-sm font-medium text-sky-600">{eyebrow}</p>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          {primaryAction ? <div>{primaryAction}</div> : null}
        </div>
        {filters ? <div>{filters}</div> : null}
      </Card>

      {hasData ? (
        <>
          <div className="hidden xl:block">
            <div className={desktopScrollClassName || "max-h-[32rem] overflow-auto"}>
              {desktopContent}
            </div>
          </div>
          <div className="grid gap-4 xl:hidden">{mobileContent}</div>
        </>
      ) : (
        <TableEmptyState>{emptyState}</TableEmptyState>
      )}
    </div>
  );
}