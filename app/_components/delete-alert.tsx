"use client";

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { DestinationRequest } from "@/lib/request/destination.request";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Trash } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryRequest } from "@/lib/request/category.request";

export default function DeleteAlert({ instance, id, title }: { instance: "destinations" | "traditions" | "categories"; id: string; title?: string }) {
  const router = useRouter();

  let request = null;
  if (instance === "categories") request = CategoryRequest;
  if (instance === "destinations") request = DestinationRequest;

  const deleteHandle = () => {
    toast.promise(request!.DELETE(id), {
      loading: `Deleting ${instance.slice(0, -1)}...`,
      success: () => {
        router.refresh();
        return `${title || instance.slice(0, -1)} was successfully deleted.`;
      },
      error: `Failed to delete ${instance.slice(0, -1)}. Please try again.`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
          Delete
          <DropdownMenuShortcut>
            <Trash className="h-4 w-4 text-red-600" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the {instance.slice(0, -1)} {title && <span className="font-semibold">"{title}"</span>}.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button size="sm" variant="destructive" onClick={deleteHandle}>
              Yes, Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
