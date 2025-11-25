"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data } = authClient.useSession();

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto flex items-center max-w-7xl justify-between py-6">
        <Link href="/" className="-m-1.5 p-1.5">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            className="h-8 w-auto"
            alt=""
          />
        </Link>

        {!data?.user ? (
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Log in
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link
                href="/organizations"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Organizations
              </Link>
            </Button>
            <Button
              onClick={(event) => {
                event.preventDefault();
                authClient.signOut();
              }}
              className="cursor-pointer"
            >
              Logout
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
