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
  id: number;
  title: string;
  department: string;
  category: string;
  creationDate: string; // ISO date string, e.g., "2025-05-10T19:29:05.836204"
  createdBy: string;
  status: string;
  downloadUrl: string;
  size?: string; //TODO
  fileType?: string; // TODO
};

export type Department = {
  id: string;
  name: string;
  createdAt: string | null;
  userCount: number | null;
};

export interface Category {
  id: number;
  name: string;
  createdAt: string | null;
}
