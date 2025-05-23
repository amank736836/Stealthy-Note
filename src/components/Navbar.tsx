"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const router = useRouter();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          Stealthy Note
        </Link>

        {session ? (
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.username || user.email}</span>
            <ThemeToggle />

            <Button
              className="w-full md:w-auto bg-slate-100 dark:bg-gray-800 text-black dark:text-white"
              variant="outline"
              onClick={() => {
                signOut();
                router.push(`/sign-in`);
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Link href="/sign-in">
              <Button className="w-full md:w-auto bg-slate-100 dark:bg-gray-800 text-black dark:text-white">
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
