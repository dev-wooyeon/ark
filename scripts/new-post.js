import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content');

async function main() {
  console.log(chalk.bold.blue('📝 Create a New Blog Post'));

  const response = await prompts([
    {
      type: 'text',
      name: 'title',
      message: 'What is the title of your post?',
      validate: (value) => (value.length > 0 ? true : 'Title is required'),
    },
    {
      type: 'text',
      name: 'slug',
      message: 'What is the slug for your post?',
      initial: (prev) => slugify(prev, { lower: true, strict: true }),
      validate: (value) => {
        if (!value) return 'Slug is required';
        if (!/^[a-z0-9-]+$/.test(value))
          return 'Slug must be kebab-case (lowercase, numbers, hyphens)';
        return true;
      },
    },
    {
      type: 'text',
      name: 'description',
      message: 'Brief description of the post:',
    },
    {
      type: 'select',
      name: 'category',
      message: 'Select a category:',
      choices: [
        { title: 'Dev', value: 'Dev' },
        { title: 'Life', value: 'Life' },
        { title: 'Travel', value: 'Travel' },
        { title: 'Review', value: 'Review' },
        { title: 'Insight', value: 'Insight' },
        { title: 'Essay', value: 'Essay' },
      ],
      initial: 0,
    },
    {
      type: 'list',
      name: 'tags',
      message: 'Enter tags (comma separated):',
      separator: ',',
    },
  ]);

  if (!response.title || !response.slug) {
    console.log(chalk.yellow('Operation cancelled.'));
    return;
  }

  const { title, slug, description, category, tags } = response;
  const date = new Date().toISOString().split('T')[0];
  const targetDir = path.join(CONTENT_DIR, slug);

  try {
    // Check if directory exists
    try {
      await fs.access(targetDir);
      console.error(
        chalk.red(`Error: Directory content/${slug} already exists!`)
      );
      process.exit(1);
    } catch (e) {
      // Directory doesn't exist, proceed
    }

    await fs.mkdir(targetDir, { recursive: true });

    // Create meta.json
    const metaData = {
      title,
      description,
      date,
      category,
      tags: tags.map((t) => t.trim()).filter(Boolean),
    };

    await fs.writeFile(
      path.join(targetDir, 'meta.json'),
      JSON.stringify(metaData, null, 2)
    );

    // Create index.mdx
    const mdxContent = `
## Introduction

Write your post content here...
`;

    await fs.writeFile(path.join(targetDir, 'index.mdx'), mdxContent.trim());

    console.log(chalk.green(`\n✅ Successfully created new post!`));
    console.log(`📂 Directory: ${chalk.cyan(`content/${slug}`)}`);
    console.log(`📄 Meta: ${chalk.cyan(`content/${slug}/meta.json`)}`);
    console.log(`📝 Content: ${chalk.cyan(`content/${slug}/index.mdx`)}\n`);
  } catch (error) {
    console.error(chalk.red('Failed to create post:'), error);
  }
}

main();
