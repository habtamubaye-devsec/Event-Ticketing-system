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
    <div className="bg-gray-100 border border-gray-solid border-gray-300 p-5 shadow-lg rounded flex flex-col gap-3">
      <h1 className="text-sm font-bold">{title}</h1>
      <p className="text-sm text-gray-500">{description}</p>
      <h1 className="text-4xl font-bold mt-2">
        {isAmountProperty ? `$${value}` : value}
      </h1>
    </div>
  );
}

export default ReportCard
