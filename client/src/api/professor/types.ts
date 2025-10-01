export interface WorkingHour {
  start: number;
  end: number;
}

export type WeekDay =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday";

export type WorkingHours = {
  [key in WeekDay]?: WorkingHour[];
};

export interface Professor {
  id: number;
  name: string;
  workingHours: WorkingHours;
  status: boolean;
  deleted: boolean;
  createTime: string; // ISO date
  updateTime: string; // ISO date
}

export interface GetAllProfessorsResponse {
  status: number;
  professors: Professor[];
}

export interface CreateProfessorRequest {
  name: string;
  workingHours: WorkingHours;
}

export interface CreateProfessorResponse {
  status: number;
  professor: Professor;
}

export interface UpdateProfessorRequest {
  name?: string;
  workingHours?: WorkingHours;
}

export interface DeleteProfessorRequest {
  id: number;
}
