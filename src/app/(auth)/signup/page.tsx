import Image from "next/image";
import signUpImage from "@/assets/signup-image.jpg";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
};

const Page = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl border-2 bg-card shadow-lg">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to PakTweet</h1>
            <p className="text-center text-muted-foreground">
              Whats Happening!
            </p>
          </div>
          <div className="space-y-5">
            <SignupForm />
            <Link href={"/login"} className="block text-center hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
        <Image
          src={signUpImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default Page;
