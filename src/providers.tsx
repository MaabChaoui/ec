"use client";
import React from "react";
import { useEffect } from "react";
import { useAppDispatch } from "./store/store";
import { loginSuccess, logout } from "./store/features/auth/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // console.log("AuthProvider called");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/auth/tempRefresh",
        );
        const { role } = await response.json();
        dispatch(loginSuccess({ role }));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch(logout());
      }
    };
    validateToken();
  }, [dispatch]);

  return <>{children}</>;
}
