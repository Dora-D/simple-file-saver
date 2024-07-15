import { User } from "./user.type";
import { File } from "./file.type";

export interface Folder {
  id: number;
  name: string;
  isPublic: boolean;
  files: File[];
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
