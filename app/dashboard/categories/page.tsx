import { CategoriesTable } from "@/app/dashboard/categories/_components/table";
import CategoriesTableSkeleton from "@/app/dashboard/categories/_components/table-skeleton";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";

const pageConfig = {
  title: "Categories",
};
export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; pageSize?: string; title?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = Number(resolvedSearchParams.pageSize) || 7;

  return (
    <>
      <SiteHeader title={pageConfig.title} add={{ url: "/dashboard/categories/create" }} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Suspense key={`${page}-${pageSize}`} fallback={<CategoriesTableSkeleton />}>
                <CategoriesTable page={page} pageSize={pageSize} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
