import { createAppSlice } from "@/lib/createAppSlice";

export interface ThemeSliceState {
  theme: "theme-light" | "theme-dark";
}

const initialState: ThemeSliceState = {
  theme: "theme-dark",
};

export const themeSlice = createAppSlice({
  name: "theme",
  initialState,
  reducers: (create) => ({
    toggleTheme: create.reducer((state) => {
      state.theme =
        state.theme === "theme-light" ? "theme-dark" : "theme-light";
    }),
  }),
  selectors: {
    selectTheme: (theme) => theme.theme,
  },
});

export const { toggleTheme } = themeSlice.actions;
export const { selectTheme } = themeSlice.selectors;
