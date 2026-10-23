import { RequestError } from "./record-policy";

export const TASK_STATUSES = ["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type TaskStatusValue = (typeof TASK_STATUSES)[number];
export type TaskPriorityValue = (typeof TASK_PRIORITIES)[number];

export function parseTaskStatus(value: unknown, fallback: TaskStatusValue = "OPEN"): TaskStatusValue {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "string" && (TASK_STATUSES as readonly string[]).includes(value)) return value as TaskStatusValue;
  throw new RequestError(`Invalid task status: ${String(value)}`, 400);
}

export function parseTaskPriority(value: unknown, fallback: TaskPriorityValue = "MEDIUM"): TaskPriorityValue {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "string" && (TASK_PRIORITIES as readonly string[]).includes(value)) return value as TaskPriorityValue;
  throw new RequestError(`Invalid task priority: ${String(value)}`, 400);
}

export function parseOptionalDate(value: unknown, field: string): Date | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new RequestError(`${field} must be an ISO date string`, 400);
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new RequestError(`${field} must be a valid date`, 400);
  return date;
}

export function parseTitle(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new RequestError("title is required", 400);
  if (value.trim().length > 500) throw new RequestError("title must be at most 500 characters", 400);
  return value.trim();
}

export function parseOptionalText(value: unknown, field: string, max = 10000): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > max) throw new RequestError(`${field} must be text of at most ${max} characters`, 400);
  return value;
}

export function parseOptionalId(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !value.trim()) throw new RequestError(`${field} must be a non-empty id`, 400);
  return value.trim();
}
