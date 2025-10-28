// scripts/filter_personal_array.js
const fs = require('fs').promises;
const path = require('path');
const { addMultiLanguageSpeciesNames } = require('./speciesReader');
const { convertTypeIdToName } = require('./convertType');

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
    let pokemonList = arr.filter((item) => item.IsPresentInGame !== false);

    // Add multi-language species names (Chinese, Japanese, English)
    ({ items: pokemonList } = await addMultiLanguageSpeciesNames(pokemonList));

    // Convert Type1 and Type2 from IDs to names
    pokemonList.forEach((item) => {
      item.Type1 = convertTypeIdToName(item.Type1);
      item.Type2 = convertTypeIdToName(item.Type2);
      if (item.Type1 === null) {
        console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid Type1 ID`);
      }

      if (item.Type2 === null) {
        console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid Type2 ID`);
      }
    });

    // console.log
    pokemonList.slice(0, 30).forEach((item, index) => {
      console.log(`${item.Name.zh}: ${item.Type1} / ${item.Type2}`);
    });

    await fs.writeFile(outputPath, JSON.stringify(pokemonList, null, 2), 'utf8');

    console.log(`Complete: wrote ${pokemonList.length} items to ${outputPath}`);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { main };
