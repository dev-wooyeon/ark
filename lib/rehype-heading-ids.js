import { visit } from 'unist-util-visit';

function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function rehypeHeadingIds() {
  const idCounts = {};

  return (tree) => {
    visit(tree, 'element', (node) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        if (!node.properties.id) {
          const text = node.children
            .filter((child) => child.type === 'text')
            .map((child) => child.value)
            .join('');

          if (text) {
            let id = generateId(text);

            // Handle duplicate IDs
            if (idCounts[id]) {
              idCounts[id]++;
              id = `${id}-${idCounts[id]}`;
            } else {
              idCounts[id] = 1;
            }

            node.properties.id = id;
          }
        }
      }
    });
  };
}
