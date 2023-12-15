import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id: 0,
    name: '',
    active: false
}

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.active = action.payload.active;
        },
        removeUserInfo: (state) => {
            state.id = 0;
            state.name = '';
            state.active = false;
        },
        updateUserInfo: (state, action) => {
            state.name = action.payload.name;
        }
    }
});

export const { setUserInfo, removeUserInfo, updateUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;