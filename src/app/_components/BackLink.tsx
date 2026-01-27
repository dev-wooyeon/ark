import Link from 'next/link';

interface BackLinkProps {
    href: string;
    text?: string;
}

export default function BackLink({ href, text = '← Back' }: BackLinkProps) {
    return (
        <Link href={href} className="back-link">
            {text}
        </Link>
    );
}
