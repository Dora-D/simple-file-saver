import { File } from "./file.type";
import { Folder } from "./folder.type";

export interface Breadcrumb {
  folderName: string;
  folderId: number;
}

export interface SearchResult {
  folder: {
    childFolders: Folder[];
    files: File[];
  };
  breadcrumbs: Breadcrumb[];
}
