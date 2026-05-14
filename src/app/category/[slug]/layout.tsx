import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const slug = (await params).slug;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${title} | Sau Il Moro`,
    description: `Scopri l'artigianato sardo d'eccellenza nella collezione ${title} di Sau Il Moro.`,
  }
}

export default async function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
