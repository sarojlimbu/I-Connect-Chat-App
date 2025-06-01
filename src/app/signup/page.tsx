"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";

import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/utils/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatFirebaseError } from "@/utils/helperFunctions";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { isLoading, setLoading } = useAuthStore();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data?.email,
        data?.password
      );

      await updateProfile(userCred.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      await addDoc(collection(db, "users"), {
        uid: userCred.user.uid,
        email: userCred.user.email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        displayName: `${data?.firstName} ${data?.lastName}`,
      });
      toast.success("Signup successful! Explore and connect.");
      router.push("/login");
    } catch (err: any) {
      toast.error(formatFirebaseError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <main className="grid gap-2">
      <Card className="w-full border-0 sm:border shadow-none max-w-sm rounded-none sm:px-4 sm:py-8">
        <CardHeader className="text-center">
          <CardTitle>LOGO</CardTitle>
          <CardDescription>
            Sign up to connect with new friends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signupForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <div>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="rounded-[2px]"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm pl-2">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  type="text"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="rounded-[2px]"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm pl-2">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="rounded-[2px]"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm pl-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="rounded-[2px]"
                />
                {errors.password && (
                  <p className="text-red-500 font-300 text-sm pl-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            form="signupForm"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="animate-spin" />}
            Sign Up
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-full border-0 sm:border shadow-none max-w-sm rounded-none sm:px-4 sm:py-8">
        <CardHeader className="flex flex-col items-center gap-0">
          <CardDescription>Have an account? </CardDescription>
          <Button onClick={navigateToLogin} size={"sm"} variant="link">
            Login
          </Button>
        </CardHeader>
      </Card>
    </main>
  );
}
