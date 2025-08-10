import { CategoryForm } from "@/app/dashboard/categories/_components/form";
import { UpdateDestinationForm } from "@/app/dashboard/destinations/[slug]/_components/form";
import { FormSkeleton } from "@/app/dashboard/destinations/[slug]/_components/form-skeleton";
import { SiteHeader } from "@/components/site-header";
import { CategoryRequest } from "@/lib/request/category.request";
import { DestinationRequest } from "@/lib/request/destination.request";
import { CategoryType, DestinationType } from "@/lib/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category: CategoryType = await CategoryRequest.GET(id);
  if (!category) notFound();
  return (
    <div className="h-dvh flex flex-col justify-start items-stretch">
      <SiteHeader title={category.name} />
      <div className="flex overflow-auto flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Suspense key={`${category.id}`} fallback={<FormSkeleton />}>
                <CategoryForm mode="update" oldCategory={category} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
