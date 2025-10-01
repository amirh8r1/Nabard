export interface Course {
  id: number;
  name: string;
  credit: number;
  durationPerWeek: number;
  semester: number;
  status: boolean;
  deleted: boolean;
  createTime: string; // ISO date
  updateTime: string; // ISO date
}

export interface GetAllCoursesResponse {
  status: number;
  courses: Course[];
}

export interface CreateCourseRequest {
  name: string;
  credit: number;
  semester: number;
}

export interface CreateCourseResponse {
  status: number;
  course: Course;
}

export interface UpdateCourseRequest {
  name?: string;
  credit?: number;
  semester?: number;
}

export interface DeleteCourseRequest {
  id: number;
}
