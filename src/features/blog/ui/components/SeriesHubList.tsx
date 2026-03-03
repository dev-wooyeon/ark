import type { SeriesSummary } from '@/features/blog/model/series-group';
import SeriesHubCard from './SeriesHubCard';

interface SeriesHubListProps {
  seriesSummaries: SeriesSummary[];
}

export default function SeriesHubList({ seriesSummaries }: SeriesHubListProps) {
  return (
    <div className="space-y-6">
      {seriesSummaries.map((summary, index) => (
        <SeriesHubCard
          key={summary.id}
          summary={summary}
          seriesIndex={index}
        />
      ))}
    </div>
  );
}

export type { SeriesHubListProps };
