import { api } from "../api";
import { GeneratePlanRequest, GeneratePlanResponse } from "./types";

export const generatePlan = async (
  data: GeneratePlanRequest
): Promise<GeneratePlanResponse> => {
  try {
    const res = await api.post("/planning/generate", data);
    return res;
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "خطا در تولید برنامه پیشنهادی",
    };
  }
};
