"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryRequest } from "@/lib/request/category.request";
import { CategoryType } from "@/lib/types";
import { CategoryValidation } from "@/lib/validation/category.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type FormValues = z.infer<typeof CategoryValidation.PATCH>;
export function CategoryForm({ mode, oldCategory }: { mode: "create" | "update"; oldCategory?: CategoryType }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(CategoryValidation.PATCH),
    defaultValues: {
      name: oldCategory?.name || "",
      description: oldCategory?.description || "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    if (mode === "create") {
      toast.promise(CategoryRequest.POST(values), {
        loading: "Creating category...",
        success: () => {
          router.push("/dashboard/categories");
          return "Category created";
        },
        error: "Failed to create category. Please check your input.",
        finally: () => setIsSubmitting(false),
      });
    } else {
      if (oldCategory?.name === values.name) values.name = undefined;
      if (oldCategory?.description === values.description) values.description = undefined;
      toast.promise(CategoryRequest.PATCH(oldCategory?.id!, values), {
        loading: "Updating category...",
        success: () => {
          router.push("/dashboard/categories");
          return "Category updated";
        },
        error: "Failed to create category. Please check your input.",
        finally: () => setIsSubmitting(false),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-1 flex-col justify-start items-stretch">
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., River" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="h-[200px]" placeholder="Description for the category" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex col-span-1 md:col-span-3 justify-end gap-2">
            <Button disabled={isSubmitting} className="flex-1" variant="secondary" asChild>
              <Link href="/dashboard/categories">Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? `${mode}...` : `${mode} destination`}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
