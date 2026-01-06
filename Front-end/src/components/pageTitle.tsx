function PageTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h1>
        <span className="hidden rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)] sm:inline-flex">
          STATUS
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div className="h-full w-full rounded-full" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-2), var(--warning))" }} />
        </div>
        <div className="hidden h-1 w-16 rounded-full bg-[var(--primary)]/50 md:block" />
      </div>
    </div>
  );
}

export default PageTitle