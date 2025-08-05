"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";

import { CategoryType } from "@/lib/types"; // Buat tipe ini
import { DestinationRequest } from "@/lib/request/destination.request"; // Impor class request destinasi
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/lib/axios";

const validation = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  mapUrl: z.string().url().optional().nullable(),
  latitude: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: "invalid number" }
  ),
  longitude: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: "invalid number" }
  ),
  categoryId: z.string().cuid({ message: "invalid category id" }),
  price: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: "invalid number" }
  ),
  tags: z.array(z.string().min(1)).optional(),
  cover: z
    .object({
      url: z.string().url().nullable(),
      publicId: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

type FormValues = z.infer<typeof validation>;

export function CreateDestinationForm({ categories }: { categories: CategoryType[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(validation),
    defaultValues: {
      title: "",
      content: "",
      address: "",
      mapUrl: "",
      latitude: "",
      longitude: "",
      categoryId: "",
      price: "",
      tags: [],
      cover: { url: null, publicId: null },
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        form.setValue("tags", newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    let coverData = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const uploadResponse = await axiosInstance.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
        coverData = uploadResponse.data.result;
      } catch (error) {
        console.log(error);
        toast.error("Image upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const finalData = {
      ...values,
      cover: coverData,
      tags: tags,
      price: Number(values.price) || 0,
      latitude: Number(values.latitude) || null,
      longitude: Number(values.longitude) || null,
    };

    toast.promise(DestinationRequest.POST(finalData), {
      loading: "Creating destination...",
      success: () => {
        router.push("/dashboard/destinations");
        return "Destination created successfully!";
      },
      error: "Failed to create destination. Please check your input.",
      finally: () => setIsSubmitting(false),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Destination Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Kuta Beach" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the destination..." {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full address" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder="-8.7183" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder="115.1685" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="mapUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Maps URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://maps.app.goo.gl/..." {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (IDR)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0 for free" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
                </FormControl>
                {imagePreview && (
                  <div className="mt-4 relative">
                    <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded-md" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input placeholder="Add tags and press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Destination"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
