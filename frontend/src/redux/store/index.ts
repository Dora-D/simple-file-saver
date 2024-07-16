import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import searchReducer from "./slices/searchSlice";
import { fileManagerApi } from "../../services/fileManagerApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { permissionsApi } from "../../services/permissionsApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    search: searchReducer,
    [fileManagerApi.reducerPath]: fileManagerApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(fileManagerApi.middleware)
      .concat(permissionsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
