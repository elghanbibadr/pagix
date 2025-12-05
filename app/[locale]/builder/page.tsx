import { getPagesByWebsiteId, loadWebsite } from "@/app/actions/websitesActions";
import BuilderClient from "./componenets/BuilderCient";


interface BuilderPageProps {
  searchParams: {
    websiteId?: string;
  };
}
export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams
  const params = await searchParams;
  const websiteId = params.websiteId as string | undefined;


    console.log('website id',websiteId)
 const websites=await loadWebsite(websiteId)
 const pages=await getPagesByWebsiteId(websiteId)



  // Pass data to client component
  return (
    <BuilderClient
      initialWebsite={websites.data.website}
      initialPages={pages.data}
      websiteId={websiteId}
    />
  );
}