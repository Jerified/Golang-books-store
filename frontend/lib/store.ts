import { configureStore } from "@reduxjs/toolkit"
import userReducer from "@/lib/features/userSlice"
import bookmarkReducer from "@/lib/features/bookmarkSlice"


export const store = configureStore({
    reducer: {
        user: userReducer,
        bookmark: bookmarkReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch