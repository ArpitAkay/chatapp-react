import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id: 0,
    name: '',
    active: false,
    status: '',
    imageUrl: ''
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
            state.status = '';
            state.imageUrl = '';
        },
        updateUserInfo: (state, action) => {
            state.name = action.payload.name;
            state.status = action.payload.profileStatus;
        },
        updateProfileImageUrl: (state, action) => {
            state.imageUrl = action.payload.profileImageUrl;
        }
    }
});

export const { setUserInfo, removeUserInfo, updateUserInfo, updateProfileImageUrl } = userInfoSlice.actions;
export default userInfoSlice.reducer;