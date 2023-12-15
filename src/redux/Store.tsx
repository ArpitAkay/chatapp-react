import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userInfoSlice } from "./slices/UserInfoSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from "redux-persist";
import { notificationPermissionSlice } from "./slices/NotificationPermission";

const persistConfig = {
    key: 'root',
    storage,
}

const reducer = combineReducers({
    userInfo: userInfoSlice.reducer,
    notificationPermission: notificationPermissionSlice.reducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
});

export const persistor = persistStore(store)