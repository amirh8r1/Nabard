export interface GeneratePlanRequest {
  assignments: {
    courseId: number;
    professors: number[];
  }[];
}

export interface GeneratedSession {
  courseId: number;
  professorId: number;
  day: string;
  start: number;
  end: number;
}

export interface GeneratePlanResponse {
  status: number;
  plan?: GeneratedSession[];
  message?: string;
}
