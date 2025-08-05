import DestinationTableSkeleton from "@/app/dashboard/destinations/_components/table-skeleton";
import { CreateDestinationForm } from "@/app/dashboard/destinations/create/_components/form";
import { SiteHeader } from "@/components/site-header";
import { CategoryRequest } from "@/lib/request/category.request";
import { CategoryType } from "@/lib/types"; // Buat tipe ini jika belum ada
import { Suspense } from "react";

type CategoryData = {
  result: CategoryType[];
};

const pageConfig = {
  title: "Create Destinations",
};

export default async function CreateDestinationPage() {
  const { data, pagination } = await CategoryRequest.GETS();

  return (
    <>
      <SiteHeader title={pageConfig.title} />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Suspense key={data} fallback={<DestinationTableSkeleton />}>
                <CreateDestinationForm categories={data} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
