   import { Button, message, Upload } from "antd";
import type { EventFormsStepProps } from ".";

function Media({
  currentStep,
  setCurrentStep,
  eventData,
  setEventData,
  selectMediaFile,
  setSelectMediaFile,
}: EventFormsStepProps) {
  const CLOUD_NAME = "dmrzeb0nc";
  const UPLOAD_PRESET = "Event-Management-System";

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setSelectMediaFile((prev: any) => [...prev, data.secure_url]);
        message.success("Image uploaded successfully!");
      } else {
        message.error("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      message.error("Upload error.");
    }
  };

  const onSelectedMediaRemove = (index: number) => {
    setSelectMediaFile((prev: any) => prev.filter((_, i) => i !== index));
  };

  const onAlreadyUploadedMediaRemove = (index: number) => {
    const existingMediaFiles = [...eventData.media];
    const newMediaFiles = existingMediaFiles.filter((_, i) => i !== index);
    setEventData({ ...eventData, media: newMediaFiles });
  };

  return (
    <div>
      <Upload
        listType="picture-card"
        accept="image/*"
        beforeUpload={(file) => {
          handleFileUpload(file);
          return false; // Prevent default upload
        }}
        multiple
        showUploadList={false}
      >
        <span className="text-gray-500 text-xs">Click here to upload</span>
      </Upload>

      <div className="flex flex-wrap gap-5 mt-8">
        {selectMediaFile.map((url: string, index: number) => (
          <div className="border p-3 border-solid border-gray-200" key={url}>
            <img src={url} alt="media" className="w-40 h-40 object-cover" />
            <span
              className="underline text-sm text-center cursor-pointer"
              onClick={() => onSelectedMediaRemove(index)}
            >
              Remove
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-5 mt-8">
        {eventData.media?.map((url: string, index: number) => (
          <div className="border p-3 border-solid border-gray-200" key={url}>
            <img src={url} alt="media" className="w-40 h-40 object-cover" />
            <span
              className="underline text-sm text-center cursor-pointer"
              onClick={() => onAlreadyUploadedMediaRemove(index)}
            >
              Remove
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-10 col-span-3 mt-5">
        <Button onClick={() => setCurrentStep(currentStep - 1)}>
          Previous
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setEventData({ ...eventData, media: selectMediaFile });
            setCurrentStep(currentStep + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Media;
