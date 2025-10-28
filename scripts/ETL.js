// scripts/filter_personal_array.js
const fs = require('fs').promises;
const path = require('path');
const { addMultiLanguageSpeciesNames } = require('./convertSpecies');
const { convertAllTypeIdsToNames } = require('./convertType');
const { convertAbilitiesNames } = require('./convertAbilities');

async function main() {
  const inputPath = path.join(__dirname, '..', 'za-textport', 'Raw', 'personal_array.json');
  const outDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(outDir, 'personal_array.json');
  const language = 'zh'; // 'zh', 'ja', 'en'

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
    pokemonList = convertAllTypeIdsToNames(pokemonList, language);

    // Convert abilities from IDs to names
    pokemonList = await convertAbilitiesNames(pokemonList, language);

    // console.log
    pokemonList.slice(0, 30).forEach((item, index) => {
      const name = `${item.Name.zh}${item.Info.Form !== 0 ? '(' + item.Info.Form + ')' : ''}`;

      console.log(`${name}: ${item.Ability1} / ${item.Ability2} / ${item.AbilityH}`);
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
