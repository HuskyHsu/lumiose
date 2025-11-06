// scripts/species-reader.js
import { readNames } from './utils.js';

// Convert ability IDs to names for all items
async function convertAbilitiesNames(items, language = 'zh') {
  // Read abilities names from multiple languages
  const [zhAbilities, jaAbilities, enAbilities] = await Promise.all([
    readNames('Trad_Chinese', 'abilities'),
    readNames('JPN', 'abilities'),
    readNames('English', 'abilities'),
  ]);

  const languageMap = {
    zh: zhAbilities,
    ja: jaAbilities,
    en: enAbilities,
  };
  const abilities = languageMap[language];

  return items.map((item) => {
    item.Ability1 = abilities[item.Ability1] || null;
    item.Ability2 = abilities[item.Ability2] || null;
    item.AbilityH = abilities[item.AbilityH] || null;

    if (item.Ability1 === null) {
      console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid Ability1 ID`);
    }

    if (item.Ability2 === null) {
      console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid Ability2 ID`);
    }

    if (item.AbilityH === null) {
      console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid AbilityH ID`);
    }

    return item;
  });
}

export { convertAbilitiesNames };
