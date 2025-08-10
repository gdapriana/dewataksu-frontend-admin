import { CategoryForm } from "@/app/dashboard/categories/_components/form";
import { SiteHeader } from "@/components/site-header";

const pageConfig = {
  title: "Create Category",
};

export default async function CreateCategoryPage() {
  return (
    <div className="h-dvh flex flex-col justify-start items-stretch">
      <SiteHeader title={pageConfig.title} />

      <div className="flex overflow-auto flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <CategoryForm mode="create" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
