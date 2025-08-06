import { UpdateDestinationForm } from "@/app/dashboard/destinations/[slug]/_components/form";
import { FormSkeleton } from "@/app/dashboard/destinations/[slug]/_components/form-skeleton";
import { SiteHeader } from "@/components/site-header";
import { CategoryRequest } from "@/lib/request/category.request";
import { DestinationRequest } from "@/lib/request/destination.request";
import { DestinationType } from "@/lib/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination: DestinationType = await DestinationRequest.GET(slug);
  const { data: categories } = await CategoryRequest.GETS();
  if (!destination) notFound();
  return (
    <div className="h-dvh flex flex-col justify-start items-stretch">
      <SiteHeader title={destination.title} />
      <div className="flex overflow-auto flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Suspense fallback={<FormSkeleton />}>
                <UpdateDestinationForm oldDestination={destination} categories={categories} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
