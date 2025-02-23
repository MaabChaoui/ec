"use client";

import { startTransition, useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

import { useDispatch } from "react-redux";
import { logout } from "@/store/features/authSlice";

import { logoutAction } from "../actions/auth/action";

const initialState = {
  error: null,
  success: false,
  token: null,
  user: null,
};

export default function LogoutMenuItem() {
  const [state, performLogout] = useActionState(logoutAction, initialState);
  const router = useRouter();
  const dispatch = useDispatch(); // Redux
  // const selector = useSelector();

  useEffect(() => {
    console.log("\nCurrent state:", state);
    if (state && state.success && !state.token) {
      dispatch(logout());
      //   Redirect to login
      router.push("/login");
    } else {
      console.log("wtf")
    }
  }, [state, router, dispatch]);

  const handleLogout = () => {
    startTransition(() => {
      performLogout();
    });
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
}
