import { API_URL } from "../config";
import { http } from "./http";
import type { Task, TaskStatus } from "../types/task";

type FetchTasksParams = {
  q?: string;
  status?: TaskStatus | "all";
};

export async function fetchTasks(
  params: FetchTasksParams = {},
): Promise<Task[]> {
  const url = new URL(`${API_URL}/tasks`);

  if (params.status && params.status !== "all")
    url.searchParams.set("status", params.status);

  const tasks = await http<Task[]>(url);
  const list = [...tasks];

  if (params.q) {
    const searchLower = params.q.toLowerCase();
    return list.filter((task) =>
      task.title.toLowerCase().includes(searchLower),
    );
  }

  return list;
}

export async function fetchTask(id: string): Promise<Task> {
  return http<Task>(`${API_URL}/tasks/${id}`);
}

export async function createTask(payload: Omit<Task, "id">): Promise<Task> {
  return http<Task>(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: string, payload: Task): Promise<Task> {
  return http<Task>(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: string): Promise<{}> {
  return http<{}>(`${API_URL}/tasks/${id}`, { method: "DELETE" });
}
