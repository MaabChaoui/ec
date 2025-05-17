export interface SessionPayload {
  id: string;
  role: string;
  name: string;
  email: string;
  token: string | null;
}

export type User = {
  id: string | number;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  name: string;
  email: string;
  status: string;
  role: string; // Typically 'user' | 'admin'
  photo: string;

  departmentIds: Array<number>;
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

export type Department = {
  id: string;
  name: string;
  createdAt: string | null;
  userCount: number | null;
};
