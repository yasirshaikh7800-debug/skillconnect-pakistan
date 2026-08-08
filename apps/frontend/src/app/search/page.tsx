import { redirect } from 'next/navigation';

export default function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolveParams = async () => {
    const params = searchParams ? await searchParams : {};
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        query.set(key === 'q' ? 'q' : key, value);
      }
    }

    redirect(`/services?${query.toString()}`);
  };

  void resolveParams();
  return null;
}
