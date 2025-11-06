const TypeIdEnMap = {
  0: 'Normal',
  1: 'Fighting',
  2: 'Flying',
  3: 'Poison',
  4: 'Ground',
  5: 'Rock',
  6: 'Bug',
  7: 'Ghost',
  8: 'Steel',
  9: 'Fire',
  10: 'Water',
  11: 'Grass',
  12: 'Electric',
  13: 'Psychic',
  14: 'Ice',
  15: 'Dragon',
  16: 'Dark',
  17: 'Fairy',
};

const TypeIdZhMap = {
  0: '普通',
  1: '格鬥',
  2: '飛行',
  3: '毒',
  4: '地面',
  5: '岩石',
  6: '蟲',
  7: '幽靈',
  8: '鋼',
  9: '火',
  10: '水',
  11: '草',
  12: '電',
  13: '超能力',
  14: '冰',
  15: '龍',
  16: '惡',
  17: '妖精',
};

const convertTypeIdToName = (typeId, language) => {
  if (language === 'zh') {
    return TypeIdZhMap.hasOwnProperty(typeId) ? TypeIdZhMap[typeId] : null;
  }
  return TypeIdEnMap.hasOwnProperty(typeId) ? TypeIdEnMap[typeId] : null;
};

const convertAllTypeIdsToNames = (items, language = 'zh') => {
  return items.map((item) => {
    item.Type1 = convertTypeIdToName(item.Type1, language);
    item.Type2 = convertTypeIdToName(item.Type2, language);

    if (item.Type1 === null) {
      console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid Type1 ID`);
    }

    if (item.Type2 === null) {
      console.warn(`Warning: Item ${item.Name?.en || 'unknown'} has invalid Type2 ID`);
    }

    return item;
  });
};

export { convertAllTypeIdsToNames, TypeIdEnMap };
