"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import logo from "../../../../public/logo/logo.png";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { formatFirebaseError } from "@/utils/helperFunctions";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { isLoading, setLoading, setUser } = useAuthStore();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        data?.email,
        data?.password
      );
      setUser({
        displayName: userCred?.user?.displayName,
        email: userCred?.user?.email,
        uid: userCred?.user?.uid,
      });

      const token = await userCred.user.getIdToken();
      document.cookie = `accessToken=${token}; path=/; max-age=${
        60 * 60 * 24
      }; secure; samesite=strict`;

      router.push("/");
    } catch (err: any) {
      toast.error(formatFirebaseError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push("/signup");
  };

  return (
    <main className="grid gap-2">
      <Card className="w-full border-0  shadow-none max-w-sm rounded-none ">
        <CardHeader className="text-center">
          <Image alt="logo" src={logo} />
        </CardHeader>
        <CardContent>
          <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                      message: "Enter valid email",
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
            form="loginForm"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="animate-spin" />}
            Log in
          </Button>
        </CardFooter>
      </Card>
      <div className="flex items-center justify-center mx-6">
        <div className="border-t border-gray-600 flex-grow"></div>
        <span className="mx-4 uppercase text-sm text-gray-600">OR</span>
        <div className="border-t border-gray-600 flex-grow"></div>
      </div>

      <Card className="w-full border-0 shadow-none  max-w-sm rounded-none ">
        <CardHeader className="flex flex-row justify-center items-center gap-0">
          <CardDescription>Don't have an account? </CardDescription>
          <Button onClick={navigateToSignup} size={"sm"} variant="link">
            Sign up
          </Button>
        </CardHeader>
      </Card>
    </main>
  );
}
