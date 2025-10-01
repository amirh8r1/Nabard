import { api } from "../api";
import {
  GetAllProfessorsResponse,
  CreateProfessorRequest,
  CreateProfessorResponse,
  UpdateProfessorRequest,
} from "./types";

export const getAllProfessors = (): Promise<GetAllProfessorsResponse> => {
  return api.get("/professor");
};

export const createProfessor = (
  data: CreateProfessorRequest
): Promise<CreateProfessorResponse> => {
  return api.post("/professor", data);
};

export async function updateProfessor(
  id: number,
  data: UpdateProfessorRequest
) {
  return api.put(`/professor/${id}`, data);
}

export async function deleteProfessor(id: number) {
  return api.delete(`/professor/${id}`);
}
