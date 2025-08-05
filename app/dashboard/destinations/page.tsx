import { Suspense } from "react";
import { DestinationsTable } from "@/app/dashboard/destinations/_components/table";
import DestinationTableSkeleton from "@/app/dashboard/destinations/_components/table-skeleton";
import { SiteHeader } from "@/components/site-header";

const pageConfig = {
  title: "Destinations",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; title?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = Number(resolvedSearchParams.pageSize) || 7;

  return (
    <>
      <SiteHeader title={pageConfig.title} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Suspense
                key={`${page}-${pageSize}`}
                fallback={<DestinationTableSkeleton />}
              >
                <DestinationsTable page={page} pageSize={pageSize} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
