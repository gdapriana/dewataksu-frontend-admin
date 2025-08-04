import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, FormEvent, SetStateAction } from "react";

export function LoginForm({
  isSubmitting,
  className,
  username,
  password,
  handleSubmit,
}: {
  isSubmitting: boolean;
  className?: string;
  handleSubmit: (e: FormEvent) => void;
  username: { setValue: Dispatch<SetStateAction<string | undefined>> };
  password: { setValue: Dispatch<SetStateAction<string | undefined>> };
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="shadow-none border-[1px] border-[rgba(0, 0, 0, 0.01]">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account as Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  disabled={isSubmitting}
                  id="username"
                  type="text"
                  onChange={(e) => username.setValue(e.target.value)}
                  placeholder="Username..."
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  disabled={isSubmitting}
                  placeholder="*********"
                  onChange={(e) => password.setValue(e.target.value)}
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  disabled={isSubmitting}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
