import { Button, Form, Input } from "antd";
import type { EventFormsStepProps } from ".";

function LocationAndDate({
  currentStep,
  setCurrentStep,
  eventData,
  setEventData,
}: EventFormsStepProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Form.Item label="Address" required>
        <Input
          placeholder="Address"
          value={eventData.address}
          onChange={(e) =>
            setEventData({ ...eventData, address: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="City" required>
        <Input
          placeholder="City"
          value={eventData.city}
          onChange={(e) => setEventData({ ...eventData, city: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="Pincode" required>
        <Input
          placeholder="Pincode"
          value={eventData.pincode}
          onChange={(e) =>
            setEventData({ ...eventData, pincode: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Date" required>
        <Input
          type="date"
          value={eventData.date}
          onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          min={new Date().toISOString().split("T")[0]}
        />
      </Form.Item>

      <Form.Item label="Time" required>
        <Input
          type="time"
          value={eventData.time}
          onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
        />
      </Form.Item>

      <div className="flex gap-10 col-span-3">
        <Button onClick={() => setCurrentStep(currentStep - 1)}>
          Previous
        </Button>
        <Button
          type="primary"
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={
            !eventData.address ||
            !eventData.city ||
            !eventData.pincode ||
            !eventData.date ||
            !eventData.time
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default LocationAndDate;
