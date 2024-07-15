import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  isMine: boolean;
}

const initialState: SearchState = {
  query: "",
  isMine: true,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setIsMine(state, action: PayloadAction<boolean>) {
      state.isMine = action.payload;
    },
  },
});

export const { setSearchQuery, setIsMine } = searchSlice.actions;

export default searchSlice.reducer;
