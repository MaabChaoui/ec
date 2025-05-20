import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import counterReducer from "./features/counterSlice";
import authReducer from "./features/auth/authSlice";
import usersReducer from "./features/usersSlice";
import departmentReducer from "./features/departmentsSlice";
import documentsReducer from "./features/documentsSlice";
import categoriesReducer from "./features/categoriesSlice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    users: usersReducer,
    departments: departmentReducer,
    documents: documentsReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
