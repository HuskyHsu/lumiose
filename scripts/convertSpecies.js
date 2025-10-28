// scripts/species-reader.js
const { readNames } = require('./utils');

/**
 * Add multi-language species names to items based on their Info.SpeciesNational index
 * Creates a Name object with Chinese, Japanese, and English names
 * @param {Array} items - Array of items to add names to
 * @returns {Promise<{items: Array, namedCount: number}>} Modified items and count of named items
 */
async function addMultiLanguageSpeciesNames(items) {
  // Read species names from multiple languages
  const [zhSpecies, jaSpecies, enSpecies] = await Promise.all([
    readNames('Trad_Chinese', 'species'),
    readNames('JPN', 'species'),
    readNames('English', 'species'),
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

module.exports = { addMultiLanguageSpeciesNames };
