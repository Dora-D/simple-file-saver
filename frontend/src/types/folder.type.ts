import { User } from "./user.type";
import { File } from "./file.type";
import { Permission } from "./permission.type";

export interface Folder {
  id: number;
  name: string;
  isPublic: boolean;
  files: File[];
  owner: User;
  parentFolderId?: number;
  permissions?: Permission[];

}

export interface FolderCreate {
  name: string;
  isPublic: boolean;
  parentFolderId?: number;
}

export interface FolderUpdate {
  name?: string;
  isPublic?: boolean;
}
