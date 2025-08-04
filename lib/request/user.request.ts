import { axiosPublic } from "@/lib/axios";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { toast } from "sonner";

export class UserRequest {
  static async LOGIN({
    body,
    setIsSubmitting,
    login,
  }: {
    body: { username: string | undefined; password: string | undefined };
    setIsSubmitting: Dispatch<SetStateAction<boolean>>;
    login: (accessToken: string) => Promise<void>;
  }) {
    setIsSubmitting(true);
    const loginPromise = async () => {
      const response = await axiosPublic.post("/login", {
        username: body.username,
        password: body.password,
      });
      const { accessToken } = response.data.data;
      if (!accessToken) {
        throw new Error("token not provided");
      }
      await login(accessToken);
    };
    toast.promise(loginPromise(), {
      loading: "loading...",
      success: () => {
        return "sucess!";
      },
      error: (err: any) => {
        const errors = err.response?.data?.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          return JSON.stringify(errors);
        }
        if (typeof errors === "string") {
          return errors;
        }
        return "something wrong";
      },
      finally: () => {
        setIsSubmitting(false);
      },
    });
  }
}
