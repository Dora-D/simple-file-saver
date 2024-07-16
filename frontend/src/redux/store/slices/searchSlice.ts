import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TSearchIn = "own" | "available";

interface SearchState {
  query: string;
  searchIn: TSearchIn;
}

const initialState: SearchState = {
  query: "",
  searchIn: "own",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setSearchIn(state, action: PayloadAction<TSearchIn>) {
      state.searchIn = action.payload;
    },
  },
});

export const { setSearchQuery, setSearchIn } = searchSlice.actions;

export default searchSlice.reducer;
