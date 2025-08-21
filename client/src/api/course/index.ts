import { api } from "../api";
import {
  GetAllCoursesResponse,
  CreateCourseRequest,
  CreateCourseResponse,
  UpdateCourseRequest,
} from "./type";

export const getAllCourses = (): Promise<GetAllCoursesResponse> => {
  return api.get("/course");
};

export const createCourse = (
  data: CreateCourseRequest
): Promise<CreateCourseResponse> => {
  return api.post("/course", data);
};

export async function updateCourse(id: number, data: UpdateCourseRequest) {
  return api.put(`/course/${id}`, data);
}

export async function deleteCourse(id: number) {
  return api.delete(`/course/${id}`);
}
