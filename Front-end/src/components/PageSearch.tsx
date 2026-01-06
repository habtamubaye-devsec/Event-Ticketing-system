import { Input } from "antd";
import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
};

export default function PageSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
}: Props) {
  return (
    <div
      className={`flex w-full items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 ${className}`}
    >
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onPressEnter={onSearch}
        allowClear
        bordered={false}
        className="h-9 flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-none focus:ring-0"
      />
      <button
        type="button"
        onClick={onSearch}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white transition hover:scale-105"
        aria-label="Search"
      >
        <Search size={16} />
      </button>
    </div>
  );
}
