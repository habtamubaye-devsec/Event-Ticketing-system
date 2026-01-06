import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  category: string;
  lastUpdated?: string;
  children: ReactNode;
};

export default function PublicContentLayout({
  title,
  subtitle,
  category,
  lastUpdated,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-12 text-[var(--text)]">
      <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_22px_70px_rgba(15,23,42,0.15)]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={14} />
          Back home
        </Link>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.5em] text-emerald-400">
            <span>{category}</span>
            {lastUpdated && (
              <span className="text-[10px] text-slate-500">Last updated {lastUpdated}</span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="text-base leading-relaxed text-[var(--muted)]">{subtitle}</p>}
        </div>
        <div className="space-y-6 text-sm text-slate-700 sm:text-base">{children}</div>
      </div>
    </div>
  );
}
