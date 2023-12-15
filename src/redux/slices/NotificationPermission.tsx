import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    permission: false
}

export const notificationPermissionSlice = createSlice({
    name: 'notificationPermission',
    initialState,
    reducers: {
        setNotificationPermission: (state, action) => {
            state.permission = action.payload.permission;
        }
    }
});

export const { setNotificationPermission } = notificationPermissionSlice.actions;
export default notificationPermissionSlice.reducer;