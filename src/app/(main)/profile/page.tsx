"use client";

import { useAuthStore } from "@/store/authStore";
import { Mail, User as UserIcon } from "lucide-react";

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          {user?.displayName?.charAt(0).toUpperCase() || <UserIcon />}
        </div>

        <h2 className="mt-4 text-xl font-semibold">{user?.displayName}</h2>

        <p className="text-gray-600 mt-1 flex items-center justify-center gap-2">
          <Mail size={16} /> {user?.email}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
