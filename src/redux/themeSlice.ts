import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
  accentColor: string;
}

const initialState: ThemeState = {
  darkMode: false,
  accentColor: '#3b82f6', // Default blue
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
      toggleDarkMode: (state) => {
        state.darkMode = !state.darkMode;
      },
      setAccentColor: (state, action: PayloadAction<string>) => {
        state.accentColor = action.payload;
      },
    },
  });
  
  export const { toggleDarkMode, setAccentColor } = themeSlice.actions;
  export default themeSlice.reducer;