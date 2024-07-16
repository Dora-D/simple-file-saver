import { User } from "./user.type";

export interface File {
  id: number;
  name: string;
  type: string;
  size: number;
  path?: string;
  isPublic: boolean;
  owner: User;
  folderId?: number;
  exp: string;
}

export interface FileUpload {
  isPublic: boolean;
  folderId?: number | string;
}

export interface FileUpdate {
  name?: string;
  isPublic?: boolean;
}
