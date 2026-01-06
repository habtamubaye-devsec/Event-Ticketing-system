import React from "react";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, description, action }: Props) {
  return (
    <div className="q-card p-6 sm:p-8 q-animate-in">
      <div className="flex flex-col gap-2">
        <div className="text-base font-extrabold tracking-tight text-[var(--text)]">
          {title}
        </div>
        {description ? (
          <div className="text-sm leading-relaxed text-[var(--muted)]">
            {description}
          </div>
        ) : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}
