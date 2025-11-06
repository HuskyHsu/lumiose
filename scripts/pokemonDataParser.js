import { promises as fs } from 'fs';

/**
 * 解析寶可夢資料文本文件並轉換為JSON格式
 * @param {string} filePath - 要解析的文本文件路徑
 * @returns {Promise<Array>} 解析後的寶可夢資料陣列
 */
async function parsePokemonData(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const pokemonList = [];

    // 按照 ====== 分割，然後重新組合每個寶可夢的完整資料
    const sections = content.split(/={6,}/);

    // 重新組合：標題行 + 對應的資料
    for (let i = 1; i < sections.length; i += 2) {
      const titleSection = sections[i] ? sections[i].trim() : '';
      const dataSection = sections[i + 1] ? sections[i + 1].trim() : '';

      if (!titleSection) continue;

      // 組合完整的寶可夢資料 - 標題行在前
      const completeSection = titleSection + '\n' + dataSection;

      const pokemon = parsePokemonSection(completeSection);
      if (pokemon) {
        pokemonList.push(pokemon);
      }
    }

    return pokemonList;
  } catch (error) {
    console.error('讀取文件時發生錯誤:', error);
    throw error;
  }
}

/**
 * 解析單個寶可夢資料區塊
 * @param {string} section - 單個寶可夢的資料區塊
 * @returns {Object|null} 解析後的寶可夢物件
 */
function parsePokemonSection(section) {
  const lines = section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
  if (lines.length === 0) return null;

  const pokemon = {};
  let foundTitle = false;

  // 尋找標題行 (例: "001 - 妙蛙種子 #148 (Stage: 1)")
  for (let i = 0; i < lines.length; i++) {
    const titleMatch = lines[i].match(/^(\d+)\s*-\s*(.+?)\s*#(\d+)\s*\(Stage:\s*(\d+)\)$/);
    if (titleMatch) {
      pokemon.pid = parseInt(titleMatch[1]);
      pokemon.name = titleMatch[2];
      pokemon.id = parseInt(titleMatch[3]);
      pokemon.stage = parseInt(titleMatch[4]);
      foundTitle = true;
      break;
    }
  }

  // 如果沒有找到標題行，跳過這個區塊
  if (!foundTitle) return null;

  // 解析其他屬性
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('Base Stats:')) {
      pokemon.base = parseBaseStats(line);
    } else if (line.startsWith('EV Yield:')) {
      pokemon.ev = parseEVYield(line);
    } else if (line.startsWith('Gender Ratio:')) {
      pokemon.genderRatio = parseGenderRatio(line);
    } else if (line.startsWith('Catch Rate:')) {
      pokemon.catchRate = parseCatchRate(line);
    } else if (line.startsWith('Abilities:')) {
      const { normal, hidden } = parseAbilities(line);
      pokemon.abilities = normal;
      pokemon.abilitiyH = hidden;
    } else if (line.startsWith('Type:')) {
      pokemon.type = parseType(line);
    } else if (line.startsWith('EXP Group:')) {
      pokemon.expGroup = parseExpGroup(line);
    } else if (line.startsWith('Egg Group:')) {
      pokemon.eggGroup = parseEggGroup(line);
    } else if (line.startsWith('Height:') || line.includes('Weight:') || line.includes('Color:')) {
      const physicalData = parsePhysicalData(line);
      Object.assign(pokemon, physicalData);
    } else if (line.startsWith('Alpha Move:')) {
      pokemon.alphaMove = parseAlphaMove(line);
    } else if (line.startsWith('Level Up Moves:')) {
      pokemon.levelUpMoves = parseLevelUpMoves(lines, i);
      // 跳過已處理的招式行
      while (i + 1 < lines.length && lines[i + 1].startsWith('- [')) {
        i++;
      }
    } else if (line.startsWith('TM Learn:')) {
      pokemon.tmMoves = parseTMMoves(lines, i);
      // 跳過已處理的TM行
      while (i + 1 < lines.length && lines[i + 1].startsWith('- [TM')) {
        i++;
      }
    } else if (line.startsWith('Evolves into')) {
      if (pokemon.evolution === undefined) {
        pokemon.evolution = [];
      }
      pokemon.evolution.push(parseEvolution(line));
    }
  }

  return pokemon;
}

/**
 * 解析基礎數值
 */
function parseBaseStats(line) {
  const match = line.match(/Base Stats:\s*(.+?)\s*\(BST:\s*(\d+)\)/);
  if (match) {
    const stats = match[1].split('.').map((s) => parseInt(s));
    return stats;
    // return {
    //   hp: stats[0] || 0,
    //   attack: stats[1] || 0,
    //   defense: stats[2] || 0,
    //   spAttack: stats[3] || 0,
    //   spDefense: stats[4] || 0,
    //   speed: stats[5] || 0,
    //   total: parseInt(match[2]),
    // };
  }
  return null;
}

/**
 * 解析EV產出
 */
function parseEVYield(line) {
  const match = line.match(/EV Yield:\s*(.+)/);
  if (match) {
    const evs = match[1].split('.').map((s) => parseInt(s));
    return evs;
    // return {
    //   hp: evs[0] || 0,
    //   attack: evs[1] || 0,
    //   defense: evs[2] || 0,
    //   spAttack: evs[3] || 0,
    //   spDefense: evs[4] || 0,
    //   speed: evs[5] || 0,
    // };
  }
  return null;
}

/**
 * 解析性別比例
 */
function parseGenderRatio(line) {
  const match = line.match(/Gender Ratio:\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

/**
 * 解析捕獲率
 */
function parseCatchRate(line) {
  const match = line.match(/Catch Rate:\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

/**
 * 解析特性
 */
function parseAbilities(line) {
  const match = line.match(/Abilities:\s*(.+)/);
  if (match) {
    const abilitiesStr = match[1];
    const abilities = [];
    const abilityH = [];

    // 解析特性格式: "茂盛 (1) | 茂盛 (2) | 葉綠素 (H)"
    const abilityMatches = abilitiesStr.split('|').map((s) => s.trim());

    for (const abilityMatch of abilityMatches) {
      const abilityParse = abilityMatch.match(/(.+?)\s*\(([^)]+)\)/);
      if (abilityParse) {
        const name = abilityParse[1].trim();

        if (abilityParse[2].trim() === 'H') {
          abilityH.push(name);
        } else {
          if (abilities.includes(name)) continue; // 避免重複
          abilities.push(name);
        }
      }
    }

    return { normal: abilities, hidden: abilityH };
  }
  return { normal: [], hidden: [] };
}

/**
 * 解析屬性
 */
function parseType(line) {
  const match = line.match(/Type:\s*(.+)/);
  if (match) {
    return match[1].split('/').map((t) => t.trim());
  }
  return [];
}

/**
 * 解析經驗值組別
 */
function parseExpGroup(line) {
  const match = line.match(/EXP Group:\s*(.+)/);
  return match ? match[1].trim() : null;
}

/**
 * 解析蛋群
 */
function parseEggGroup(line) {
  const match = line.match(/Egg Group:\s*(.+)/);
  if (match) {
    return match[1].split('/').map((g) => g.trim());
  }
  return [];
}

/**
 * 解析身高體重顏色
 */
function parsePhysicalData(line) {
  const result = {};

  const heightMatch = line.match(/Height:\s*([0-9.]+)m/);
  if (heightMatch) {
    result.height = parseFloat(heightMatch[1]);
  }

  const weightMatch = line.match(/Weight:\s*([0-9.]+)kg/);
  if (weightMatch) {
    result.weight = parseFloat(weightMatch[1]);
  }

  const colorMatch = line.match(/Color:\s*(\w+)/);
  if (colorMatch) {
    result.color = colorMatch[1];
  }

  return result;
}

/**
 * 解析Alpha招式
 */
function parseAlphaMove(line) {
  const match = line.match(/Alpha Move:\s*(.+)/);
  return match ? match[1].trim() : null;
}

/**
 * 解析等級招式
 */
function parseLevelUpMoves(lines, startIndex) {
  const moves = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('- [')) break;

    // 解析格式: "- [01] 撞擊 {10}"
    const moveMatch = line.match(/- \[(\d+)\]\s*(.+?)\s*\{(\d+)\}/);
    if (moveMatch) {
      moves.push({
        level: parseInt(moveMatch[1]),
        name: moveMatch[2].trim(),
        plus: parseInt(moveMatch[3]),
      });
    }
  }

  return moves;
}

/**
 * 解析TM招式
 */
function parseTMMoves(lines, startIndex) {
  const moves = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('- [TM')) break;

    // 解析格式: "- [TM007] 劇毒"
    const tmMatch = line.match(/- \[TM(\d+)\]\s*(.+)/);
    if (tmMatch) {
      moves.push({
        tm: parseInt(tmMatch[1]),
        name: tmMatch[2].trim(),
      });
    }
  }

  return moves;
}

/**
 * 解析進化資訊
 */
function parseEvolution(line) {
  // 解析格式: "Evolves into 妙蛙草-0 @ lv16 (LevelUp) [0]"
  const match = line.match(/Evolves into\s*(.+?)\s*@\s*lv(\d+)\s*\((.+?)\)\s*\[(.+)\]/);
  if (match) {
    return {
      into: match[1].trim(),
      level: parseInt(match[2]),
      method: match[3].trim(),
      condition: match[4],
    };
  }
  return null;
}

/**
 * 將解析結果保存為JSON文件
 * @param {Array} pokemonData - 寶可夢資料陣列
 * @param {string} outputPath - 輸出文件路徑
 */
async function saveToJSON(pokemonData, outputPath) {
  try {
    const jsonString = JSON.stringify(pokemonData, null, 2);
    await fs.writeFile(outputPath, jsonString, 'utf8');
    console.log(`成功保存 ${pokemonData.length} 筆寶可夢資料到 ${outputPath}`);
  } catch (error) {
    console.error('保存JSON文件時發生錯誤:', error);
    throw error;
  }
}

/**
 * 主要執行函數
 * @param {string} inputFile - 輸入文件路徑
 * @param {string} outputFile - 輸出文件路徑（可選）
 */
async function main(inputFile, outputFile) {
  try {
    console.log('開始解析寶可夢資料...');

    const pokemonData = await parsePokemonData(inputFile);
    console.log(`成功解析 ${pokemonData.length} 筆寶可夢資料`);

    // 如果指定了輸出文件，則保存為JSON
    if (outputFile) {
      await saveToJSON(pokemonData, outputFile);
    }

    return pokemonData;
  } catch (error) {
    console.error('解析過程中發生錯誤:', error);
    throw error;
  }
}

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('使用方法: node pokemonDataParser.js <輸入文件> [輸出文件]');
    console.log('範例: node pokemonDataParser.js pokemon_data.txt pokemon_data.json');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || inputFile.replace(/\.[^.]+$/, '.json');

  main(inputFile, outputFile)
    .then(() => {
      console.log('解析完成！');
    })
    .catch((error) => {
      console.error('執行失敗:', error);
      process.exit(1);
    });
}

export { main, parsePokemonData, saveToJSON };
