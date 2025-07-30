import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useImageGenerationMutations = () => {
  const queryClient = useQueryClient();

  const createImage = useMutation({
    mutationFn: async (data: any) => {
      console.log("Mutation: Sending data:", data); // Debug log
      const result = await axios.post("/api/imageGeneration", { text: data });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["savedRecipes"] });
    },
  });

  return { createImage };
};
