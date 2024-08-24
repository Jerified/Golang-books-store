import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookmarkState {
    bookmarks: string[]; // Array of book IDs
}

const initialState: BookmarkState = {
    bookmarks: [],
};

export const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState,
    reducers: {
        addBookmark: (state, action: PayloadAction<string>) => {
            state.bookmarks.push(action.payload);
        },
        removeBookmark: (state, action: PayloadAction<string>) => {
            state.bookmarks = state.bookmarks.filter((id) => id !== action.payload);
        },
        setBookmarks: (state, action: PayloadAction<string[]>) => {
            state.bookmarks = action.payload;
        },
    },
});

export const { addBookmark, removeBookmark, setBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
