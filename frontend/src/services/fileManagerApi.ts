import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../utilities/baseQuery";
import { File as FileType, FileUpdate, FileUpload } from "../types/file.type";
import { SearchResult } from "../types/search.type";
import { Folder, FolderCreate, FolderUpdate } from "../types/folder.type";
import { TSearchIn } from "../redux/store/slices/searchSlice";

export const fileManagerApi = createApi({
  reducerPath: "fileManagerApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL as string,
  }),
  tagTypes: ["Files", "Folders"],
  endpoints: (builder) => ({
    getFileById: builder.query<FileType, number>({
      query: (id) => ({ url: `/files/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Files", id }],
    }),
    uploadFile: builder.mutation<FileType, { file: File; data: FileUpload }>({
      query: ({ file, data }) => {
        const formData = new FormData();
        formData.append("file", file);
        Object.entries(data).forEach(([key, value]) => {
          if (key !== "name" && value) {
            formData.append(key, value.toString());
          }
        });
        return {
          url: "/files/upload",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: ["Files"],
    }),
    updateFile: builder.mutation<FileType, { id: number; data: FileUpdate }>({
      query: ({ id, data }) => ({
        url: `/files/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Files"],
    }),
    deleteFile: builder.mutation<void, number>({
      query: (id) => ({ url: `/files/${id}`, method: "DELETE" }),
      invalidatesTags: ["Files"],
    }),
    downloadFile: builder.query<Blob, number>({
      query: (id) => ({
        url: `/files/download/${id}`,
        method: "GET",
        responseType: "blob",
      }),
    }),
    cloneFile: builder.mutation<FileType, number>({
      query: (id) => ({ url: `/files/${id}/clone`, method: "POST" }),
      invalidatesTags: ["Files"],
    }),
    getFolderById: builder.query<Folder, number>({
      query: (id) => ({ url: `/folders/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Folders", id }],
    }),
    createFolder: builder.mutation<Folder, FolderCreate>({
      query: (data) => ({
        url: "/folders",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Folders"],
    }),
    updateFolder: builder.mutation<Folder, { id: number; data: FolderUpdate }>({
      query: ({ id, data }) => ({
        url: `/folders/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Folders"],
    }),
    deleteFolder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/folders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folders"],
    }),
    cloneFolder: builder.mutation<Folder, number>({
      query: (id) => ({
        url: `/folders/${id}/clone`,
        method: "POST",
      }),
      invalidatesTags: ["Folders"],
    }),
    search: builder.query<
      SearchResult,
      { query: string; folderId?: number; searchIn: TSearchIn }
    >({
      query: ({ query, folderId, searchIn }) => ({
        url: "/search",
        method: "GET",
        params: { query, folderId, searchIn },
      }),
      providesTags: ["Files", "Folders"],
    }),
  }),
});

export const {
  useSearchQuery,
  useGetFileByIdQuery,
  useGetFolderByIdQuery,
  useCreateFolderMutation,
  useUploadFileMutation,
  useUpdateFileMutation,
  useUpdateFolderMutation,
  useCloneFileMutation,
  useCloneFolderMutation,
  useDeleteFileMutation,
  useDeleteFolderMutation,
  useDownloadFileQuery,
} = fileManagerApi;
