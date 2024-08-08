import SearchInput from "@/components/SearchInput";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          PakTweet
        </Link>

        <SearchInput />

        <UserButton className="sm:ms-auto" />
      </nav>
    </header>
  );
};

export default Navbar;
