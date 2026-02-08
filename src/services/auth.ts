import { loginApi } from "@/API/Api";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  token: string;
};

export async function loginService(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const res = await fetch(loginApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message ?? "Login failed");
  }
  return data;
}
