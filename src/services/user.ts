/* eslint-disable @typescript-eslint/no-explicit-any */

import { getuserApi } from "@/API/Api";


// Get all agents
export async function getUserListService({ limit, skip }: { limit: number; skip: number }) {
  try {
    const response = await fetch(`${getuserApi}?limit=${limit}&skip=${skip}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}
