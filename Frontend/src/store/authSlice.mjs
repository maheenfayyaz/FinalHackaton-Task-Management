import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || '',
        userID: localStorage.getItem("userID") || '',
        userName: localStorage.getItem("userName") || '',
        userImage: localStorage.getItem("userImage") || '',
        userRole: localStorage.getItem("userRole") || '',
        isAuthenticated: !!localStorage.getItem("token"),
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.userID = action.payload.userID;
            state.userName = action.payload.userName;
            state.userImage = action.payload.userImage || '';
            state.userRole = action.payload.userRole || '';
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("userID", action.payload.userID);
            localStorage.setItem("userName", action.payload.userName);
            localStorage.setItem("userImage", action.payload.userImage || '');
            localStorage.setItem("userRole", action.payload.userRole || '');
            state.isAuthenticated = true;
        },
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("userID");
            localStorage.removeItem("userName");
            localStorage.removeItem("userImage");
            localStorage.removeItem("userRole");
            state.token = '';
            state.userID = '';
            state.userName = '';
            state.userImage = '';
            state.userRole = '';
            state.isAuthenticated = false;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
