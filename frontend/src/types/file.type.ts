// File.ts
export interface File {
  id: number;
  name: string;
  type: string;
  size: number;
  path: string;
  isPublic: boolean;
  ownerId: number;
  folderId?: number;
}

export interface FileUploadRequest {
  name: string;
  isPublic: boolean;
  folderId?: number;
}

export interface FileUpdateRequest {
  name?: string;
  isPublic?: boolean;
  folderId?: number;
}
