export interface SessionPayload {
  id: string;
  role: string;
}

export type User = {
  id: string;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  name: string;
  email: string;
  status: string;
  role: string; // Typically 'user' | 'admin'
  photo: string;
};

export type Document = {
  id: string;
  name: string;
  type: "folder" | "file";
  folder?: string;
  created_at: string;
  updated_at: string;
  size?: string;
  extension?: string;
  url?: string;
};
