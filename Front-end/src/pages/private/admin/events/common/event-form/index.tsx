import { useState } from "react";
import { Form, message, Steps } from "antd";
import General from "./general";
import LocationAndDate from "./location-and-date";
import Media from "./media";
import Tickets from "./tickets";

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
    <div>
      <Form layout="vertical">
        <Steps current={currentStep} onChange={(step) => setCurrentStep(step)}>
          {stepsData.map((step, index) => (
            <Steps.Step key={index} title={step.name} />
          ))}
        </Steps>
        <div className="mt-5">{stepsData[currentStep].component}</div>
      </Form>
    </div>
  );
}

export default EventForm;
