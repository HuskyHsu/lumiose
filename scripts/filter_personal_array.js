// scripts/filter_personal_array.js
const fs = require('fs').promises;
const path = require('path');

async function main() {
  const inputPath = path.join(__dirname, '..', 'za-textport', 'Raw', 'personal_array.json');
  const outDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(outDir, 'personal_array.json');

  try {
    await fs.mkdir(outDir, { recursive: true });

    const text = await fs.readFile(inputPath, 'utf8');
    const data = JSON.parse(text).Table;

    if (!Array.isArray(data)) {
      console.error('input JSON is not an array.');
      process.exitCode = 2;
      return;
    }

    const filtered = data.filter((item) => item.IsPresentInGame !== false);

    await fs.writeFile(outputPath, JSON.stringify(filtered, null, 2), 'utf8');

    console.log(`Done: wrote ${filtered.length} items to ${outputPath}`);
  } catch (err) {
    console.error('error: ', err.message || err);
    process.exitCode = 1;
  }
}

if (require.main === module) main();
module.exports = { main };
