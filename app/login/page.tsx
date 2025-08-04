"use client";
import LoadingSpinner from "@/app/_components/loading-spinner";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/context/auth-context";
import { UserRequest } from "@/lib/request/user.request";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Page() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await UserRequest.LOGIN({
      body: { username, password },
      login,
      setIsSubmitting,
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!isLoading && isAuthenticated) return redirect("/dashboard");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          isSubmitting={isSubmitting}
          username={{ setValue: setUsername }}
          password={{ setValue: setPassword }}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
