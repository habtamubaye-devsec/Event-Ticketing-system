import { Button, Form, Input } from "antd";

function Filters({
  filters,
  setFilters,
  onFilter,
  className = "",
}: {
  filters: any;
  setFilters: (filters: any) => void;
  onFilter: (filters: any) => void;
  className?: string;
}) {
  const canApply = Boolean(filters.date?.trim?.() || filters.searchText?.trim?.());
  const applyButtonStyle = canApply
    ? {
        backgroundImage: "linear-gradient(135deg, var(--primary), var(--primary-2))",
        borderColor: "transparent",
        color: "#fff",
        boxShadow: "0 14px 30px rgba(99,102,241,0.3)",
      }
    : {
        background: "var(--surface-2)",
        borderColor: "var(--border)",
        color: "var(--muted)",
        boxShadow: "none",
      };
  return (
    <div
      className={`q-card p-4 sm:p-5 ${className}`}
      style={{ background: "var(--surface)" }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-4 text-sm font-semibold text-[var(--text)]">
        <div>
          <p className="text-base font-extrabold tracking-wide">Filters</p>
          <p className="text-xs text-[var(--muted)]">Refine by date and clear in one tap</p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-2)] px-3 py-1 text-[var(--surface)] text-[0.6rem] font-semibold uppercase tracking-[0.3em] shadow-[0_10px_20px_rgba(99,102,241,0.25)]">
          Date only
        </span>
      </div>
      <Form layout="vertical" className="space-y-4 pt-4">
        <Form.Item className="space-y-2" label="Event Date">
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border border-[var(--border)] bg-transparent text-[var(--text)] rounded-2xl px-3 py-2 transition focus:border-[var(--primary)] focus:ring-0 focus:outline-none"
            style={{ background: "var(--surface-2)" }}
          />
          <p className="text-xs text-[var(--muted)]">Choose the starting date for events</p>
        </Form.Item>

        <div className="flex flex-wrap gap-3 justify-end">
          <Button
            type="text"
            className="rounded-full border border-[var(--border)] px-5 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--text)]"
            onClick={() => {
              const reset = { ...filters, searchText: "", date: "" };
              setFilters(reset);
              onFilter(reset);
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            className="rounded-full px-6 py-2 text-sm font-semibold text-white"
            style={applyButtonStyle}
            disabled={!canApply}
            onClick={() => onFilter(filters)}
          >
            Apply
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Filters;
