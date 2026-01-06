import { Button, Form, Input, Select } from "antd";

type ReportFiltersState = {
  eventId: string;
  startDate: string;
  endDate: string;
};

type EventOption = { _id: string; name: string };

function ReportFilters({
  filters,
  setFilters,
  events = [],
  onFilter,
}: {
  filters: ReportFiltersState;
  setFilters: (next: ReportFiltersState) => void;
  events?: EventOption[];
  onFilter?: () => void;
}) {
  let disableFilterBtn = false;

  if (!filters.startDate && filters.endDate) {
    disableFilterBtn = true;
  }

  if (filters.startDate && !filters.endDate) {
    disableFilterBtn = true;
  }

  return (
    <div className="q-card">
      <Form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end gap-5"
        layout="vertical"
      >
        <Form.Item label="Event">
          <Select
            value={filters.eventId || ""}
            onChange={(value) => setFilters({ ...filters, eventId: value })}
          >
            <Select.Option value="">All</Select.Option>
              {events.map((event) => (
              <Select.Option key={event._id} value={event._id}>
                {event.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Start Date">
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item label="End Date">
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </Form.Item>

        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={() => {
              const emptyFilters = { eventId: "", startDate: "", endDate: "" };
              setFilters(emptyFilters);
              onFilter?.();
            }}
          >
            Clear
          </Button>
          <Button type="primary" onClick={onFilter} disabled={disableFilterBtn}>
            Fetch Report
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ReportFilters;
