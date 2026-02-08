const API_VAR = import.meta.env.VITE_BACKEND_URL ?? "https://dummyjson.com";

// users
export const getuserApi = `${API_VAR}/users`;
export const loginApi = `${API_VAR}/auth/login`;

// posts
export const postsApi = `${API_VAR}/posts`;

// recipes
export const recipesApi = `${API_VAR}/recipes`;

// products
export const productsApi = `${API_VAR}/products`;


