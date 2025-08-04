"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";

import data from "./data.json";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/app/_components/loading-spinner";
import { redirect } from "next/navigation";

const pageConfig = {
  title: "Dashboard",
};

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (!isLoading && !isAuthenticated) return redirect("/login");

  return (
    <>
      <SiteHeader title={pageConfig.title} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
