import { redirect } from 'next/navigation';

const CollectionsPage = ({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string };
}) => {
  redirect(`/search/${params.collection}?${new URLSearchParams(searchParams || {}).toString()}`);
};

export default CollectionsPage;
