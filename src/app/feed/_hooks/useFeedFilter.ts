import { useState, useMemo } from 'react';
import { FeedData } from '@/types';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export type FilterType = 'All' | 'Dev' | 'Life';

export function useFeedFilter(feed: FeedData[]) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL에서 초기 필터 상태 가져오기 (기본값: 'All')
    const initialFilter = (searchParams.get('category') as FilterType) || 'All';
    const [activeFilter, setActiveFilterState] = useState<FilterType>(initialFilter);

    // 필터 변경 핸들러 (URL 업데이트 포함)
    const setActiveFilter = (filter: FilterType) => {
        setActiveFilterState(filter);

        const params = new URLSearchParams(searchParams.toString());
        if (filter === 'All') {
            params.delete('category');
        } else {
            params.set('category', filter);
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // 필터링된 피드 데이터 (메모이제이션)
    const filteredFeed = useMemo(() => {
        return feed.filter((item) => {
            if (activeFilter === 'All') return true;
            // Case-insensitive comparison
            return item.category?.toLowerCase() === activeFilter.toLowerCase();
        });
    }, [feed, activeFilter]);

    return {
        activeFilter,
        setActiveFilter,
        filteredFeed,
    };
}
