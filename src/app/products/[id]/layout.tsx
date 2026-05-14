import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const id = (await params).id;

  return {
    title: `Prodotto ${id} | Sau Il Moro`,
    description: "Dettagli dell'eccellenza artigiana sarda. Materiali pregiati e lavorazione manuale di lusso.",
  }
}

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
