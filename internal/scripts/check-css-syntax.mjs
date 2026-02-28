import fs from 'fs/promises';
import path from 'path';
import postcss from 'postcss';

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'src');

async function collectCssFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return collectCssFiles(fullPath);
      }
      if (entry.isFile() && entry.name.endsWith('.css')) {
        return [fullPath];
      }
      return [];
    })
  );

  return files.flat();
}

function formatError(error, filePath) {
  const relativePath = path.relative(ROOT, filePath);
  const line = error.line ?? '?';
  const column = error.column ?? '?';
  const reason = error.reason || error.message || 'Unknown CSS syntax error';
  return `${relativePath}:${line}:${column} ${reason}`;
}

async function validateCssFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  try {
    postcss.parse(content, { from: filePath });
    return null;
  } catch (error) {
    return formatError(error, filePath);
  }
}

async function main() {
  const cssFiles = await collectCssFiles(TARGET_DIR);

  if (cssFiles.length === 0) {
    console.log('No CSS files found under src/.');
    return;
  }

  const results = await Promise.all(cssFiles.map(validateCssFile));
  const errors = results.filter(Boolean);

  if (errors.length > 0) {
    console.error('CSS syntax check failed:');
    errors.forEach((entry) => console.error(`- ${entry}`));
    process.exit(1);
  }

  console.log(`CSS syntax check passed for ${cssFiles.length} files.`);
}

main().catch((error) => {
  console.error('CSS syntax check failed with unexpected error:', error);
  process.exit(1);
});
