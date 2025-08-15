import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMealPlans = () => {
  return useQuery({
    queryKey: ["mealPlans"],
    queryFn: async () => {
      const { data } = await axios("/apl/mealPlans");
      return data;
    },
  });
};
