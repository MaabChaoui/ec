export interface SessionPayload {
  id: string;
  role: string;
}

export type User = {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  name: string;
  email: string;
  status: string;
  role: string; // Typically 'user' | 'admin'
  photo: string;
};
