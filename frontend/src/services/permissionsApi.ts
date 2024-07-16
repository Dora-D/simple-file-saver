import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "../utilities/baseQuery";
import {
  CreatePermissionRequest,
  Permission,
  UpdatePermissionRequest,
} from "../types/permission.type";

const baseUrl = process.env.REACT_APP_BACKEND_URL as string;

export const permissionsApi = createApi({
  reducerPath: "permissionsApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${baseUrl}/permissions` }),
  tagTypes: ["Permissions"],
  endpoints: (builder) => ({
    getPermissions: builder.query<Permission[], void>({
      query: () => ({ url: "" }),
      providesTags: ["Permissions"],
    }),
    getPermissionById: builder.query<Permission, number>({
      query: (id) => ({ url: `/${id}` }),
      providesTags: ["Permissions"],
    }),
    getPermissionsByFileId: builder.query<Permission[], number>({
      query: (fileId) => ({ url: `/file/${fileId}`, method: "GET" }),
      providesTags: ["Permissions"],
    }),

    getPermissionsByFolderId: builder.query<Permission[], number>({
      query: (folderId) => ({ url: `/folder/${folderId}`, method: "GET" }),
      providesTags: ["Permissions"],
    }),
    createPermission: builder.mutation<Permission, CreatePermissionRequest>({
      query: (data) => ({
        url: "",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Permissions"],
    }),
    updatePermission: builder.mutation<
      Permission,
      { id: number; data: UpdatePermissionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Permissions"],
    }),
    deletePermission: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permissions"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useGetPermissionsByFileIdQuery,
  useGetPermissionsByFolderIdQuery,
} = permissionsApi;
