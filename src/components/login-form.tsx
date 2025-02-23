"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "../actions/auth/action";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/features/authSlice";

// Update the initial state to include JWT token and user data
const initialState = {
  error: null,
  success: false,
  token: null,
  user: null,
};

// Submit button component
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "..." : "Login"}
    </Button>
  );
}

export function LoginForm() {
  // const [state, formAction] = useFormState(loginAction, initialState);
  const [state, formAction] = useActionState(loginAction, initialState);
  const router = useRouter();
  const dispatch = useDispatch();

  // Only access state properties when state is defined
  useEffect(() => {
    if (state && state.success && state.token) {
      dispatch(loginSuccess({ token: state.token, user: state.user }));
      router.push("/dashboard");
    }
  }, [state, dispatch, router]);

  return (
    <Card className="-translate-y-[10%] mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Use your company account to login</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          {state?.error && (
            <div className="text-red-500 text-sm">{state.error}</div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot Password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" />
          </div>
          <SubmitButton />
          <div className="mt-4 text-center text-sm">
            Facing a problem?{" "}
            <Link href="#" className="underline">
              Contact HR
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
