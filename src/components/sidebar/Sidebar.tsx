"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, LogOut, User } from "lucide-react";
import { Separator } from "../ui/separator";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import logo from "../../../public/logo/logo.png";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const menu = [{ name: "Chat", icon: <MessageCircle size={20} />, href: "/" }];

  const handleLogout = () => {
    router.push("/login");
    logout();
  };

  const isActive = pathname === "/profile";

  return (
    <aside className="h-screen  w-20 flex flex-col items-center justify-between py-2 bg-gray-50 border-r">
      <div className="mb-4 flex flex-col gap-2 ">
        <Link
          className="text-2xl font-bold cursor-pointer text-gray-600 "
          href="/"
        >
          <Image className="h-13 cover w-full" alt="logo" src={logo} />
        </Link>

        <Separator />
        <nav className="flex flex-col gap-2 items-center pt-1">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="group">
                <div
                  className={`p-3 rounded-full transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-500 hover:bg-blue-100"
                  }`}
                >
                  {item.icon}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mb-4 flex flex-col gap-2 ">
        <Link key={"profile"} href={"/profile"} className="group">
          <div
            className={`p-3 rounded-full transition-colors duration-200 ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:bg-blue-100"
            }`}
          >
            <User size={20} />
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-blue-100 text-gray-500 rounded-full p-3"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
