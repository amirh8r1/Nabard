import axios from "axios";
import { authAtom, store } from "../store/states";
import { CONFIGURATIONS } from "../utils/configurations";
import { refresh } from "./auth";

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
}

function addSubscriber(callback: (token: string) => void) {
  subscribers.push(callback);
}

const api = axios.create({
  baseURL: CONFIGURATIONS.BASE_URL,
  headers: {
    "content-type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const auth = store.get(authAtom);
    if (auth) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const {
          session: { accessToken },
        } = await refresh();

        store.set(authAtom, {
          accessToken,
        });

        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        onTokenRefreshed(accessToken);

        return axios(originalRequest);
      } catch (refreshError) {
        store.set(authAtom, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export { api };
