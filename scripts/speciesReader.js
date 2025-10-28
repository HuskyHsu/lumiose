// scripts/species-reader.js
const fs = require('fs').promises;
const path = require('path');

/**
 * Read species name table from a text file (one species name per line)
 * @param {string} language - Language folder name (e.g., 'Trad_Chinese', 'English', 'JPN')
 * @returns {Promise<string[]>} Array of species names
 */
async function readSpeciesNames(language) {
  // Construct the path to the species.txt file based on language
  const speciesPath = path.join(__dirname, '..', 'za-textport', language, 'species.txt');
  try {
    const text = await fs.readFile(speciesPath, 'utf8');
    return text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  } catch (e) {
    // If unable to read species file, return empty array and warn
    console.warn(
      'Warning: Unable to read species.txt, will skip name annotation ->',
      e.message || e
    );
    return [];
  }
}

/**
 * Add species names to items based on their Info.SpeciesNational index
 * Places the Name property at the beginning of each object for better readability
 * @param {Array} items - Array of items to add names to
 * @param {string} language - Language folder name (e.g., 'Trad_Chinese', 'English', 'JPN')
 * @returns {Promise<{items: Array, namedCount: number}>} Modified items and count of named items
 */
async function addSpeciesNames(items, language) {
  const species = await readSpeciesNames(language);
  let namedCount = 0;

  if (species.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const idx =
        item && item.Info && Number.isFinite(item.Info.SpeciesNational)
          ? item.Info.SpeciesNational
          : null;
      if (idx !== null && idx >= 0 && idx < species.length) {
        // Restructure object to put Name first
        items[i] = {
          Name: species[idx],
          ...item,
        };
        namedCount++;
      }
    }
  }

  return { items, namedCount };
}

/**
 * Add multi-language species names to items based on their Info.SpeciesNational index
 * Creates a Name object with Chinese, Japanese, and English names
 * @param {Array} items - Array of items to add names to
 * @returns {Promise<{items: Array, namedCount: number}>} Modified items and count of named items
 */
async function addMultiLanguageSpeciesNames(items) {
  // Read species names from multiple languages
  const [zhSpecies, jaSpecies, enSpecies] = await Promise.all([
    readSpeciesNames('Trad_Chinese'),
    readSpeciesNames('JPN'),
    readSpeciesNames('English'),
  ]);

  let namedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const idx =
      item && item.Info && Number.isFinite(item.Info.SpeciesNational)
        ? item.Info.SpeciesNational
        : null;

    if (idx !== null && idx >= 0) {
      const nameObj = {};
      let hasAnyName = false;

      // Add Chinese name if available
      if (idx < zhSpecies.length && zhSpecies[idx]) {
        nameObj.zh = zhSpecies[idx];
        hasAnyName = true;
      }

      // Add Japanese name if available
      if (idx < jaSpecies.length && jaSpecies[idx]) {
        nameObj.ja = jaSpecies[idx];
        hasAnyName = true;
      }

      // Add English name if available
      if (idx < enSpecies.length && enSpecies[idx]) {
        nameObj.en = enSpecies[idx];
        hasAnyName = true;
      }

      if (hasAnyName) {
        // Restructure object to put Name first
        items[i] = {
          Name: nameObj,
          ...item,
        };
        namedCount++;
      }
    }
  }

  return { items, namedCount };
}

module.exports = { readSpeciesNames, addSpeciesNames, addMultiLanguageSpeciesNames };
