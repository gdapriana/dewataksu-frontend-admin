import { SiteHeader } from "@/components/site-header";

const pageConfig = {
  title: "Team",
};

export default async function Page() {
  return (
    <>
      <SiteHeader title={pageConfig.title} />
    </>
  );
}
