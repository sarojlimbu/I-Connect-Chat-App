"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Settings, LogOut, User } from "lucide-react";
import { Input } from "./ui/input";
// import { Separator } from "./ui/separator";

const Sidebar = () => {
  const pathname = usePathname();

  const menu = [
    { name: "Chat", icon: <MessageCircle size={20} />, href: "/" },
    // { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];

  return (
    <aside className="h-screen  w-20 flex flex-col items-center justify-between py-2 bg-gray-50 border-r">
      {/* Logo */}
      <div className="mb-4 flex flex-col gap-2 ">
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer text-gray-600">
            Logo
          </div>
        </Link>
        {/* <Separator /> */}
        <nav className="flex flex-col gap-2 items-center">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="group">
                <div
                  className={`p-2 rounded-lg transition-colors duration-200 ${
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

      {/* Logout */}
      <div className="mb-4">
        <button className="p-2 hover:bg-blue-100 text-gray-500 rounded-lg">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
