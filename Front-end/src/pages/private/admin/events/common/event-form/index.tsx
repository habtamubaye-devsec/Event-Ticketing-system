import { useState } from "react";
import { Form, message, Steps } from "antd";
import General from "./general";
import LocationAndDate from "./location-and-date";
import Media from "./media";
import Tickets from "./tickets";
import Card from "../../../../../../components/ui/Card";
import SectionHeader from "../../../../../../components/ui/SectionHeader";

export interface EventFormsStepProps {
  eventData: any;
  setEventData: any;
  setCurrentStep: any;
  currentStep: number;
  selectMediaFile: any;
  setSelectMediaFile: any;
  type?: "create" | "edit"; 
}

function EventForm({
  initialData = {},
  type = "create",
}: {
  initialData?: any;
  type: "create" | "edit";
}) {
  
  const [eventData, setEventData] = useState<any>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const commonProps = { eventData, setEventData, setCurrentStep, currentStep, type};
  const [selectMediaFile, setSelectMediaFile] = useState([]);
  

  const stepsData = [
    {
      name: "General",
      component: <General {...commonProps} />,
    },
    {
      name: "Location And Date",
      component: <LocationAndDate {...commonProps} />,
    },
    {
      name: "Media",
      component: (
        <Media
          {...commonProps}
          selectMediaFile={selectMediaFile}
          setSelectMediaFile={setSelectMediaFile}
        />
      ),
    },
    {
      name: "Tickets",
      component: <Tickets {...commonProps} />,
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader
        title={type === "edit" ? "Edit Event" : "Create Event"}
        subtitle="Complete the steps to publish your event"
      />

      <Form layout="vertical">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Steps panel */}
          <Card className="p-4 lg:col-span-4 q-animate-in">
            <div className="text-xs font-semibold text-[var(--muted)] mb-3">
              Steps
            </div>
            <Steps
              direction="vertical"
              size="small"
              current={currentStep}
              onChange={(step) => setCurrentStep(step)}
            >
              {stepsData.map((step, index) => (
                <Steps.Step key={index} title={step.name} />
              ))}
            </Steps>
          </Card>

          {/* Step content */}
          <Card className="p-4 sm:p-6 lg:col-span-8 q-animate-in">
            <div className="text-sm font-extrabold tracking-tight text-[var(--text)]">
              {stepsData[currentStep].name}
            </div>
            <div className="mt-4">{stepsData[currentStep].component}</div>
          </Card>
        </div>
      </Form>
    </div>
  );
}

export default EventForm;
