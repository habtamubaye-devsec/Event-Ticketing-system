import { Button, Form, Input, Select } from "antd";

function ReportFilters({
  filters,
  setFilters,
  events = [],
  onFilter,
}: {
  filters: any;
  setFilters: any;
  events?: any[];
  onFilter?: any;
}) {
  let disableFilterBtn = false;

  if (!filters.startDate && filters.endDate) {
    disableFilterBtn = true;
  }

  if (filters.startDate && !filters.endDate) {
    disableFilterBtn = true;
  }

  return (
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
          {events.map((event: any) => (
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
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
      </Form.Item>

      <div className="flex gap-5">
        <Button
          onClick={() => {
            const emptyFilters = { eventId: "", startDate: "", endDate: "" };
            setFilters(emptyFilters);
            onFilter();
          }}
        >
          Clear Filter
        </Button>{" "}
        <Button type="primary" onClick={onFilter} disabled={disableFilterBtn}>
          Fetch Report
        </Button>
      </div>
    </Form>
  );
}

export default ReportFilters;
