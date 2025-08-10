"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";

import { CategoryType } from "@/lib/types";
import { DestinationGalleryRequest, DestinationRequest } from "@/lib/request/destination.request";
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import { PreviewFile } from "@/app/dashboard/destinations/create/_components/gallery-dropzone";
import { DestinationFormValidation } from "@/lib/validation/destination.validation";

type FormValues = z.infer<typeof DestinationFormValidation.POST>;

export function CreateDestinationForm({ categories }: { categories: CategoryType[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<PreviewFile[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(DestinationFormValidation.POST),
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

    let galleryData = [];
    if (galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFiles.forEach((file) => galleryFormData.append("images", file));
      const galleryRes = await axiosInstance.post("/bulk-upload", galleryFormData, { headers: { "Content-Type": "multipart/form-data" } });
      galleryData = galleryRes.data.result;
    }

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
      success: async (id) => {
        // if (galleryData && galleryData.length > 0) await DestinationGalleryRequest.POST(galleryData, id);
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
          <Card className="shadow-none md:col-span-2 md:row-span-4">
            <CardHeader>
              <CardTitle>Destination Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-1 flex-col justify-start items-stretch">
              <FormField
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col justify-start items-stretch">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="flex-1" placeholder="Describe the destination..." {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              {!imagePreview ? (
                <div className="relative">
                  <Input disabled={isSubmitting} type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-8 text-center transition-all duration-200 cursor-pointer">
                    <div className="p-4 bg-muted-foreground/5 rounded-full w-fit mx-auto mb-4">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">Click to upload image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <img src={imagePreview} alt="Image Preview" className="w-full h-48 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none gap-1">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button disabled={isSubmitting} onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input disabled={isSubmitting} placeholder="Add tags and press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown} />
            </CardContent>
          </Card>
          {/* <Card className="shadow-none md:col-span-3">
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              <GalleryDropzone files={galleryFiles} setFiles={setGalleryFiles} />
            </CardContent>
          </Card> */}

          <div className="flex col-span-1 md:col-span-3 justify-end gap-2">
            <Button disabled={isSubmitting} className="flex-1" variant="secondary" asChild>
              <Link href="/dashboard/destinations">Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Destination"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
