export interface TaskPayload {
  title: string;
  description: string;
  dueDate?: string;
  estado?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

const BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE}/tasks`);
  if (!res.ok) throw new Error('Error fetching tasks');
  return res.json();
}

export async function createTask(payload: TaskPayload): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const msg = data?.message || data?.error || res.statusText;
    throw new Error(Array.isArray(msg) ? msg.join('; ') : String(msg));
  }

  return res.json();
}