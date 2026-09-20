"use client";
import React from "react";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
      <Link href="/">
        <h1 className="font-bold text-3xl">Study Planner</h1>
      </Link>
      <div className="flex space-x-4">
        <Link href="/user/register" className="hover:text-gray-400">
          Login/Signup
        </Link>
        <Link href="/user/profile" className="hover:text-gray-400">
          Profile
        </Link>
        <Link href="/user/logout" className="hover:text-gray-400">
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
