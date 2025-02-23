import Link from "next/link";
import React from "react";
// import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex bold-xl flex-col italic text-xl h-screen w-full pt-20 items-center mb-5 px-4">
      Welcome
      <div className="w-[500px] h-[500px] border-[1px] mt-10 rounded-[5px] bg-gray-400/[0.1]"></div>
      <Link href="/dashboard/docs" className="rounded bg-slate-500 m-4 p-4 bold not-italic duration-150 hover:scale-[105%]">
        See docs
      </Link>
    </div>
  );
}
