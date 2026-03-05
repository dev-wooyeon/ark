import EngineeringSeriesPage from '@/features/blog/ui/pages/EngineeringSeriesPage';

export default async function EngineeringSeriesRoutePage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;

  return <EngineeringSeriesPage seriesId={decodeURIComponent(seriesId)} />;
}
