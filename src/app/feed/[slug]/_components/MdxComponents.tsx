import { ComponentPropsWithoutRef } from 'react';

function generateHeadingId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Space to hyphen
        .replace(/-+/g, '-') // Multiple hyphens to single
        .trim();
}

function getTextFromChildren(children: React.ReactNode): string {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(getTextFromChildren).join('');
    if (typeof children === 'object' && children !== null && 'props' in children) {
        return getTextFromChildren((children as any).props.children);
    }
    return '';
}

const Heading = (level: number) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return ({ children, ...props }: ComponentPropsWithoutRef<any>) => {
        const text = getTextFromChildren(children);
        const id = generateHeadingId(text);

        return (
            <Tag id={id} {...props}>
                {children}
            </Tag>
        );
    };
};

export const mdxComponents = {
    h1: Heading(1),
    h2: Heading(2),
    h3: Heading(3),
    h4: Heading(4),
    h5: Heading(5),
    h6: Heading(6),
};
