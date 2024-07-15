import { File } from "./file.type";
import { Folder } from "./folder.type";

export interface SearchResult {
  files: File[];
  folders: Folder[];
}
