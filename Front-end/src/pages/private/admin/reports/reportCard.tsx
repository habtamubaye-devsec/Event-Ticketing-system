function ReportCard({
  title,
  description,
  value,
  isAmountProperty,
}: {
  title: string;
  description: string;
  value: string | number;
  isAmountProperty: boolean;
}) {
  return (
    <div className="q-card p-5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
          {title}
        </h3>
        <div
          className="h-2 w-2 rounded-full"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-2))" }}
        />
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {description}
      </p>
      <div className="mt-2 text-3xl sm:text-4xl font-black" style={{ color: "var(--text)" }}>
        {isAmountProperty ? `$${value}` : value}
      </div>
    </div>
  );
}

export default ReportCard
