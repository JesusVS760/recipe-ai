import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMealPlans = () => {
  return useQuery({
    queryKey: ["mealPlans"],
    queryFn: async () => {
      console.log("Fetching meal plans...");
      const { data } = await axios("/api/mealPlans");
      console.log("API response:", data);
      return data.mealPlans || data;
    },
  });
};
