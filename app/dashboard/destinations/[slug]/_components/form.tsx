"use client";

import { useEffect, useState } from "react";
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
import { Loader2, Trash2, Upload, X } from "lucide-react";

import { CategoryType, DestinationType, ImageType, TagType } from "@/lib/types";
import { DestinationRequest } from "@/lib/request/destination.request";
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import { DestinationFormValidation } from "@/lib/validation/destination.validation";
// import { PreviewFile } from "@/app/dashboard/destinations/create/_components/gallery-dropzone";
// import { GalleryDropzone } from "@/app/dashboard/destinations/[slug]/_components/gallery-dropzone";

type FormValues = z.infer<typeof DestinationFormValidation.PATCH>;

export function UpdateDestinationForm({ oldDestination, categories }: { oldDestination: DestinationType; categories: CategoryType[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>(oldDestination?.tags?.map((t) => t.name) || []);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  // const [existingGallery, setExistingGallery] = useState<ImageType[]>(oldDestination.galleries?.map((g) => g.image as ImageType) || []);
  // const [galleryFiles, setGalleryFiles] = useState<PreviewFile[]>([]);
  // const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  useEffect(() => {
    if (oldDestination.cover?.url) setImagePreview(oldDestination.cover.url);
  }, [oldDestination]);

  const form = useForm<FormValues>({
    resolver: zodResolver(DestinationFormValidation.PATCH),
    defaultValues: {
      title: oldDestination?.title || "",
      content: oldDestination?.content || "",
      address: oldDestination?.address || "",
      mapUrl: oldDestination?.mapUrl || "",
      latitude: String(oldDestination?.latitude || ""),
      longitude: String(oldDestination?.longitude || ""),
      categoryId: oldDestination?.categoryId || "",
      price: String(oldDestination?.price || ""),
      tags: oldDestination?.tags?.map((t) => t.name) || [],
      cover: oldDestination?.cover || { url: null, publicId: null },
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

  // const handleRemoveExistingImage = (imageId: string) => {
  //   setExistingGallery((prev) => prev.filter((img) => img.id !== imageId));
  //   setImagesToDelete((prev) => [...prev, imageId]);
  // };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    let coverData = oldDestination?.cover || null;
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
      } finally {
        setIsSubmitting(false);
      }
    }

    const finalData = {
      ...values,
      cover: coverData,
      tags: tags,
      price: Number(values.price) || undefined,
      latitude: Number(values.latitude) || undefined,
      longitude: Number(values.longitude) || undefined,
    };

    if (oldDestination.title === finalData.title) finalData.title = undefined;
    if (oldDestination.address === finalData.address) finalData.address = undefined;
    if (oldDestination.categoryId === finalData.categoryId) finalData.categoryId = undefined;
    if (oldDestination.content === finalData.content) finalData.content = undefined;
    if (oldDestination.price === finalData.price) finalData.price = undefined;
    if (oldDestination.latitude === finalData.latitude) finalData.latitude = undefined;
    if (oldDestination.longitude === finalData.longitude) finalData.longitude = undefined;

    if (imagePreview === null) finalData.cover = null;

    toast.promise(DestinationRequest.PATCH(oldDestination.id, finalData), {
      loading: "Updating destination...",
      success: () => {
        router.push("/dashboard/destinations");
        return "Destination update successfully!";
      },
      error: "Failed to update destination. Please check your input.",
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                      <FormControl className="w-full">
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
                      disabled={isSubmitting}
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
              {existingGallery.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Existing Images</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {existingGallery.map((img) => (
                      <div key={img.id} className="relative group aspect-square">
                        <img src={img.url!} alt="existing gallery" className="w-full h-full object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(img.id)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Image"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Add New Images</p>
                <GalleryDropzone files={galleryFiles} setFiles={setGalleryFiles} />
              </div>
            </CardContent>
          </Card> */}

          <div className="flex justify-end gap-2">
            <Button className="flex-1" variant="secondary" asChild>
              <Link href="/dashboard/destinations">Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Updating..." : "Update Destination"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
