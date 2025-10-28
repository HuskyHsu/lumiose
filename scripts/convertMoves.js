// scripts/species-reader.js
const { get } = require('http');
const { readNames } = require('./utils');

/**
 * Add multi-language species names to items based on their Info.SpeciesNational index
 * Creates a Name object with Chinese, Japanese, and English names
 * @param {Array} items - Array of items to add names to
 * @returns {Promise<Array>} Modified items and count of named items
 */
async function addMultiLanguageMoveNames(items) {
  // Read species names from multiple languages
  const [zhMoves, jaMoves, enMoves] = await Promise.all([
    readNames('Trad_Chinese', 'moves'),
    readNames('JPN', 'moves'),
    readNames('English', 'moves'),
  ]);

  const getNames = (idx) => {
    const nameObj = {};

    // Add Chinese name if available
    if (idx < zhMoves.length && zhMoves[idx]) {
      nameObj.zh = zhMoves[idx];
    }

    // Add Japanese name if available
    if (idx < jaMoves.length && jaMoves[idx]) {
      nameObj.ja = jaMoves[idx];
    }

    // Add English name if available
    if (idx < enMoves.length && enMoves[idx]) {
      nameObj.en = enMoves[idx];
    }

    return nameObj;
  };

  const TMs = await readNames('English', 'tm');
  const tmMoveIdSet = new Set();
  const TMMap = Object.fromEntries(
    TMs.map((tm) => {
      const [id, name] = tm.split('	');
      const moveIdx = enMoves.indexOf(name);
      const move = {
        Move: moveIdx,
        TM: id,
      };
      tmMoveIdSet.add(moveIdx);
      return [moveIdx, move];
    })
  );

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    for (let i = 0; i < item.Learnset.length; i++) {
      const move = item.Learnset[i];
      const idx = move && move.Move ? move.Move : null;

      if (idx !== null && idx >= 0) {
        const nameObj = getNames(idx);

        if (Object.keys(nameObj).length === 0) {
          console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid Move ID ${idx}`);
        }

        item.Learnset[i] = {
          Name: nameObj,
          ...move,
        };
      }
    }

    item.TechnicalMachine = item.TechnicalMachine.filter((tmIdx) => tmMoveIdSet.has(tmIdx));
    for (let i = 0; i < item.TechnicalMachine.length; i++) {
      const idx = item.TechnicalMachine[i];

      if (idx !== null && idx >= 0) {
        const nameObj = getNames(idx);

        if (Object.keys(nameObj).length === 0) {
          console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid Move ID ${idx}`);
        }

        item.TechnicalMachine[i] = {
          Name: nameObj,
          Move: idx,
          TM: TMMap[idx].TM,
        };
      }
    }
    item.TechnicalMachine = item.TechnicalMachine.sort((a, b) => {
      if (a.TM < b.TM) return -1;
      if (a.TM > b.TM) return 1;
      return 0;
    });
  }

  return items;
}

module.exports = { addMultiLanguageMoveNames };
