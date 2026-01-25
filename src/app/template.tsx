import PageTransition from '@/components/features/animation/PageTransition';

export default function Template({ children }: { children: React.ReactNode }) {
    return <PageTransition>{children}</PageTransition>;
}
