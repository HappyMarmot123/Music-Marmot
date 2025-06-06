"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/providers/authProvider";
import AuthButtons from "@/shared/components/authButtons";
import { useToggle } from "@/app/providers/toggleProvider";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { user, isLoadingSession } = useAuth();
  const { openToggle } = useToggle();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-md h-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-white text-xl font-bold">EDMM</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {!isLoadingSession &&
          (user ? (
            <div className="flex items-center gap-4">
              <span className="text-white">Welcome, {user.email}</span>
              <button
                onClick={openToggle}
                className="text-white p-2 rounded-md hover:bg-gray-700"
              >
                <Menu />
              </button>
            </div>
          ) : (
            <AuthButtons />
          ))}
      </div>
    </nav>
  );
}
