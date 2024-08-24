import { createSlice } from "@reduxjs/toolkit"

interface UserState {
    data: any;
}

const initialState: UserState = {
    data: {}
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { setData } = userSlice.actions;
export default userSlice.reducer