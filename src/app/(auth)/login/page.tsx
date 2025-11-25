"use client"

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default  function Login() {

 const { data } =  authClient.useSession();
 const router = useRouter();

  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    if (data?.session) {
      router.push("/");
    }
  }, [data?.session, router]);

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(null);
    }
  };


  return (
    <div className="grid place-content-center h-screen bg-slate-100">
      <div className="flex flex-col justify-center gap-5 items-center h-[50vh] w-[400px] bg-white shadow-md">
        <img src="/logo.png" className="h-10 w-auto" alt="" />
        <p className="text-md font-bold">Log in to continue</p>
        <div
          className="py-1 px-6 rounded cursor-pointer flex justify-center items-center gap-2 bg-white border-[1px] border-gray-200 font-medium w-5/6"
          onClick={handleGoogleLogin}
        >
          <img
            className="h-10"
            src="https://pbs.twimg.com/profile_images/1605297940242669568/q8-vPggS_400x400.jpg"
            alt=""
          />
          {isLoading === "google" ? "Logging in..." : "Sign in with Google"}
        </div>
        <div
          className="py-1 px-6 rounded cursor-pointer flex justify-center items-center gap-2 bg-white border-[1px] border-gray-200 font-medium w-5/6"
          onClick={() => {
            authClient.signIn.email({
              email: "test@gmail.com",
              password: "test123456",
            });
          }}
        >
          {isLoading === "test" ? "Logging in..." : "Sign in with testing acc"}
        </div>
        <div
          className="py-1 px-6 rounded cursor-pointer flex justify-center items-center gap-2 bg-white border-[1px] border-gray-200 font-medium w-5/6"
          onClick={() => {
            authClient.signUp.email({
              email: "test@gmail.com",
              password: "test123456",
              name: "test",
              image: "https://github.com/shadcn.png",
            });
          }}
        >
          {isLoading === "signup" ? "Signing up..." : "Sign up with testing acc"}
        </div>
        <Link
          href="/"
          className="text-center text-xs text-blue-800 cursor-pointer underline"
        >
          Go to home page
        </Link>
      </div>
      <img
        src="/login_1.svg"
        className="hidden lg:block absolute bottom-0 left-0 w-[25%]"
        alt=""
      />
      <img
        src="/login_2.svg"
        className="hidden lg:block absolute bottom-0 right-0 w-[25%]"
        alt=""
      />
    </div>
  );
};
