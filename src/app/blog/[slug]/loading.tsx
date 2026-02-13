import { RouteLoading } from '@/components/ui';

export default function Loading() {
  return (
    <RouteLoading
      title="게시글을 불러오는 중입니다"
      description="본문과 목차를 준비하고 있습니다."
    />
  );
}
