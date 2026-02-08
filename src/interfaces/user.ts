export type user = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  id?: number;
  image?: string;
  role?: "admin" | "user";
  token?: string;
};