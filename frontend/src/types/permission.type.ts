export enum EPermissionType {
  VIEW = "view",
  EDIT = "edit",
}

export type PermissionType = EPermissionType.EDIT | EPermissionType.VIEW;

export interface Permission {
  id: number;
  userId: number;
  ownerId: number;
  fileId?: number;
  folderId?: number;
  type: PermissionType;
}

export interface CreatePermissionRequest {
  email: string;
  fileId?: number;
  folderId?: number;
  type: PermissionType;
}

export interface UpdatePermissionRequest {
  type?: PermissionType;
}
