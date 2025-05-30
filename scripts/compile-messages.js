import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const localesDir = 'public/locales';
const outputDir = 'compiled-locales';

// Get list of locale directories
const locales = readdirSync(localesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log('Found locales:', locales);

// Process each locale
for (const locale of locales) {
  const localeDir = join(localesDir, locale);
  const messages = {};
  
  // Read all JSON files in the locale directory
  const files = readdirSync(localeDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const filePath = join(localeDir, file);
    const content = JSON.parse(readFileSync(filePath, 'utf-8'));
    Object.assign(messages, content);
  }
  
  // Write combined messages
  const outputPath = join(outputDir, `${locale}.json`);
  writeFileSync(outputPath, JSON.stringify(messages, null, 2));
  console.log(`Compiled ${locale} messages to ${outputPath}`);
}

console.log('Message compilation complete!');