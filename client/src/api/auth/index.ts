import axios from "axios";
import { CONFIGURATIONS } from "../../utils/configurations";
import { api } from "../api";
import { LoginRequest, LoginResponse, RefreshResponse } from "./types";

export const getAuth = () => {
  return api.get("/auth");
};

export const login = (payload: LoginRequest): Promise<LoginResponse> => {
  return api.post("/auth/login", { auth: payload }, { withCredentials: true });
};

export const refresh = (): Promise<RefreshResponse> => {
  return axios
    .get(`${CONFIGURATIONS.BASE_URL}/auth/refresh`, {
      withCredentials: true,
    })
    .then((result) => result.data);
};
