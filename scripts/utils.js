import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readNames(language, type) {
  // Construct the path to the type.txt file based on language and type
  const typePath = path.join(__dirname, '..', 'za-textport', language, `${type}.txt`);
  try {
    const text = await fs.readFile(typePath, 'utf8');
    return text.split(/\r?\n/).map((s) => s.trim());
  } catch (e) {
    // If unable to read type file, return empty array and warn
    console.warn(
      `Warning: Unable to read ${type}.txt, will skip name annotation ->`,
      e.message || e
    );
    return [];
  }
}

export { readNames };
