export interface User {
  name: string;
  credits: number;
}

export interface ModelResult {
  id: string;
  prompt: string;
  imageUrl: string;
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, init);
  if (!response.ok) throw new Error(`${init?.method ?? 'GET'} ${path} failed with ${response.status}`);
  return response.json();
};

export const api = {
  me: () => request<User>('/me'),
  results: () => request<ModelResult[]>('/results'),
  execute: (prompt: string) =>
    request<ModelResult>('/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    }),
};
