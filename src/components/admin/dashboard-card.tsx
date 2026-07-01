import type { ReactNode } from "react";

type DashboardCardProps = {
  label: string;
  value: number | string;
  hint?: string;
  icon?: ReactNode;
};

export function DashboardCard({ label, value, hint, icon }: DashboardCardProps) {
  return (
    <article className="rounded-2xl border border-atres-border bg-atres-surface p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-atres-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-atres-text">{value}</p>
          {hint ? <p className="mt-2 text-xs leading-5 text-atres-muted">{hint}</p> : null}
        </div>
        {icon ? (
          <div className="rounded-xl bg-atres-primary/10 p-2 text-atres-primary">
            {icon}
          </div>
        ) : null}
      </div>
    </article>
  );
}
