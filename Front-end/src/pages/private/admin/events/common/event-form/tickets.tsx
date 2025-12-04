import { Button, Input, message } from "antd";
import type { EventFormsStepProps } from ".";
import { DeleteIcon } from "lucide-react";
import {
  createEvent,
  updateEvent,
} from "../../../../../../api-services/events-service";
import { useNavigate, useParams } from "react-router-dom";

function Tickets({
  currentStep,
  setCurrentStep,
  eventData,
  setEventData,
  type,
}: EventFormsStepProps) {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const handleSubmit = async () => {
    try {
      if (type === "edit") {
        await updateEvent(eventData, params.id);
        message.success("Events Updated Successfully");
      } else {
        await createEvent(eventData);
        message.success("Events Created Successfully");
      }
      navigate("/admin/events");
    } catch (error) {
      console.error("Update event error:", error);
      console.log("params.id:", params.id);
      message.error("Failed to save event");
    }
  };

  const onAddTicketType = () => {
    const existingTicketTypes = eventData.ticketTypes || [];
    const updatedTickets = [
      ...existingTicketTypes,
      { name: "", price: 0, limit: 0 },
    ];
    setEventData({ ...eventData, ticketTypes: updatedTickets });
  };

  const onTicketTypesPropertyValueChange = ({
    property,
    value,
    index,
  }: {
    property: string;
    value: string | number;
    index: number;
  }) => {
    const newTicketTypes = [...(eventData.ticketTypes || [])];
    newTicketTypes[index][property] = value;
    setEventData({ ...eventData, ticketTypes: newTicketTypes });
  };

  const removeTicketType = (index: number) => {
    const newTicketTypes = [...eventData.ticketTypes];
    newTicketTypes.splice(index, 1);
    setEventData({ ...eventData, ticketTypes: newTicketTypes });
  };

  return (
    <div className="flex flex-col gap-5">
      <Button onClick={onAddTicketType} className="w-max">
        Add Ticket Type
      </Button>

      {eventData?.ticketTypes?.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-5 font-semibold">
            <span>Name</span>
            <span>Price</span>
            <span>Limit</span>
            <span>Action</span>
          </div>

          {eventData.ticketTypes.map((ticketType: any, index: number) => (
            <div key={index} className="grid grid-cols-4 gap-5 items-center">
              <Input
                placeholder="Name"
                value={ticketType.name}
                onChange={(e) =>
                  onTicketTypesPropertyValueChange({
                    property: "name",
                    value: e.target.value,
                    index,
                  })
                }
              />
              <Input
                placeholder="Price"
                type="number"
                value={ticketType.price}
                onChange={(e) =>
                  onTicketTypesPropertyValueChange({
                    property: "price",
                    value: Number(e.target.value),
                    index,
                  })
                }
              />
              <Input
                placeholder="Limit"
                type="number"
                value={ticketType.limit}
                onChange={(e) =>
                  onTicketTypesPropertyValueChange({
                    property: "limit",
                    value: Number(e.target.value),
                    index,
                  })
                }
              />
              <Button
                type="link"
                danger
                onClick={() => removeTicketType(index)}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-10 col-span-3 mt-5">
        <Button onClick={() => setCurrentStep(currentStep - 1)}>
          Previous
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Tickets;
