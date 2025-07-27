export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  session: {
    accessToken: string;
  };
}

export interface RefreshResponse {
  session: {
    accessToken: string;
  };
}
