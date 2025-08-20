export default function MealPlanCard({
  mealPlanData,
}: {
  mealPlanData: any[];
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  console.log(mealPlanData);
  return (
    <div className="space-y-4">
      {mealPlanData.map((plan, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4 border">
          <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Start: {formatDate(plan.startDate)}</div>
            <div>End: {formatDate(plan.endDate)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
