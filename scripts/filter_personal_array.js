// scripts/filter_personal_array.js
const fs = require('fs').promises;
const path = require('path');
const { addMultiLanguageSpeciesNames } = require('./species-reader');

async function main() {
  const inputPath = path.join(__dirname, '..', 'za-textport', 'Raw', 'personal_array.json');
  const outDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(outDir, 'personal_array.json');

  try {
    await fs.mkdir(outDir, { recursive: true });

    // Read and parse raw personal array
    const text = await fs.readFile(inputPath, 'utf8');
    const parsed = JSON.parse(text);
    // Support two formats: direct array, or { Table: [...] }
    const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed.Table) ? parsed.Table : null;
    if (!arr) {
      throw new Error('Input JSON does not contain array (array or Table)');
    }

    // Filter: remove items where IsPresentInGame === false
    const filtered = arr.filter((item) => item.IsPresentInGame !== false);

    // Add multi-language species names (Chinese, Japanese, English)
    const { items: namedItems, namedCount } = await addMultiLanguageSpeciesNames(filtered);

    await fs.writeFile(outputPath, JSON.stringify(namedItems, null, 2), 'utf8');

    console.log(
      `Complete: wrote ${namedItems.length} items to ${outputPath}, annotated ${namedCount} names`
    );
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { main };
