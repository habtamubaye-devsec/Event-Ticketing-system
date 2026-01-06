import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export default function SectionHeader({ title, subtitle, right }: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--text)]">
          {title}
        </h2>
        {subtitle ? (
          <div className="mt-1 text-sm text-[var(--muted)]">{subtitle}</div>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
