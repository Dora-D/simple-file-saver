import { User } from "./user.type";

export interface Folder {
  id: number;
  name: string;
  isPublic: boolean;
  owner: User;
  parentFolderId?: number;
}

export interface FolderCreate {
  name: string;
  isPublic: boolean;
  parentFolderId?: number;
}

export interface FolderUpdate {
  name?: string;
  parentFolderId?: number;
}
