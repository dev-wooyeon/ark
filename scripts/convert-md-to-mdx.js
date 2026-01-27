const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const feedsDir = path.join(process.cwd(), 'feeds');
const files = fs.readdirSync(feedsDir).filter(file => file.endsWith('.md'));

console.log(`Found ${files.length} markdown files to convert`);

files.forEach(file => {
  const filePath = path.join(feedsDir, file);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // Parse frontmatter
  const { data, content } = matter(fileContents);

  // Create base filename (without .md extension)
  const baseName = file.replace(/\.md$/, '');

  // Write metadata JSON file
  const metaPath = path.join(feedsDir, `${baseName}.meta.json`);
  fs.writeFileSync(metaPath, JSON.stringify(data, null, 2));
  console.log(`✓ Created ${baseName}.meta.json`);

  // Write MDX content file (no frontmatter)
  const mdxPath = path.join(feedsDir, `${baseName}.mdx`);
  fs.writeFileSync(mdxPath, content.trim());
  console.log(`✓ Created ${baseName}.mdx`);

  // Backup original .md file
  const backupPath = path.join(feedsDir, `${baseName}.md.backup`);
  fs.renameSync(filePath, backupPath);
  console.log(`✓ Backed up ${file} to ${baseName}.md.backup`);
});

console.log('\n✅ Conversion complete!');
console.log('Review the generated files, then manually delete .md.backup files when satisfied.');
