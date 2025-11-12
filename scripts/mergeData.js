import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MoveCategoryMap } from './convertMoves.js';
import { TypeIdEnMap } from './convertType.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const atlFormMap = {
  '妙蛙花-1': 'MEGA',
  '噴火龍-1': 'MEGA-X',
  '噴火龍-2': 'MEGA-Y',
  '水箭龜-1': 'MEGA',
  '大針蜂-1': 'MEGA',
  '大比鳥-1': 'MEGA',
  '雷丘-1': 'Alola',
  '皮可西-1': 'MEGA',
  '胡地-1': 'MEGA',
  '大食花-1': 'MEGA',
  '呆呆獸-1': 'Galar',
  '呆殼獸-1': 'MEGA',
  '呆殼獸-2': 'Galar',
  '耿鬼-1': 'MEGA',
  '袋獸-1': 'MEGA',
  '寶石海星-1': 'MEGA',
  '凱羅斯-1': 'MEGA',
  '暴鯉龍-1': 'MEGA',
  '化石翼龍-1': 'MEGA',
  '快龍-1': 'MEGA',
  '超夢-1': 'MEGA-X',
  '超夢-2': 'MEGA-Y',
  '大竺葵-1': 'MEGA',
  '大力鱷-1': 'MEGA',
  '電龍-1': 'MEGA',
  '呆呆王-1': 'Galar',
  '大鋼蛇-1': 'MEGA',
  '巨鉗螳螂-1': 'MEGA',
  '赫拉克羅斯-1': 'MEGA',
  '盔甲鳥-1': 'MEGA',
  '黑魯加-1': 'MEGA',
  '班基拉斯-1': 'MEGA',
  '沙奈朵-1': 'MEGA',
  '勾魂眼-1': 'MEGA',
  '大嘴娃-1': 'MEGA',
  '波士可多拉-1': 'MEGA',
  '恰雷姆-1': 'MEGA',
  '雷電獸-1': 'MEGA',
  '巨牙鯊-1': 'MEGA',
  '噴火駝-1': 'MEGA',
  '七夕青鳥-1': 'MEGA',
  '詛咒娃娃-1': 'MEGA',
  '阿勃梭魯-1': 'MEGA',
  '冰鬼護-1': 'MEGA',
  '暴飛龍-1': 'MEGA',
  '巨金怪-1': 'MEGA',
  '長耳兔-1': 'MEGA',
  '烈咬陸鯊-1': 'MEGA',
  '路卡利歐-1': 'MEGA',
  '暴雪王-1': 'MEGA',
  '艾路雷朵-1': 'MEGA',
  '雪妖女-1': 'MEGA',
  '炎武王-1': 'MEGA',
  '龍頭地鼠-1': 'MEGA',
  '差不多娃娃-1': 'MEGA',
  '蜈蚣王-1': 'MEGA',
  '頭巾混混-1': 'MEGA',
  '麻麻鰻魚王-1': 'MEGA',
  '水晶燈火靈-1': 'MEGA',
  '泥巴魚-1': 'Galar',
  '布里卡隆-1': 'MEGA',
  '妖火紅狐-1': 'MEGA',
  '甲賀忍蛙-1': 'Ash',
  '甲賀忍蛙-3': 'MEGA',
  彩粉蝶: '冰雪花紋',
  '彩粉蝶-1': '雪原花紋',
  '彩粉蝶-2': '大陸花紋',
  '彩粉蝶-3': '庭園花紋',
  '彩粉蝶-4': '高雅花紋',
  '彩粉蝶-5': '花園花紋',
  '彩粉蝶-6': '摩登花紋',
  '彩粉蝶-7': '大海花紋',
  '彩粉蝶-8': '群島花紋',
  '彩粉蝶-9': '雪國花紋',
  '彩粉蝶-10': '荒野花紋',
  '彩粉蝶-11': '沙塵花紋',
  '彩粉蝶-12': '大河花紋',
  '彩粉蝶-13': '驟雨花紋',
  '彩粉蝶-14': '熱帶草原花紋',
  '彩粉蝶-15': '太陽花紋',
  '彩粉蝶-16': '大洋花紋',
  '彩粉蝶-17': '熱帶雨林花紋',
  '彩粉蝶-18': '幻彩花紋',
  '彩粉蝶-19': '球球花紋',
  '火炎獅-1': 'MEGA',
  花蓓蓓: '紅花',
  '花蓓蓓-1': '橙花',
  '花蓓蓓-2': '黃花',
  '花蓓蓓-3': '藍花',
  '花蓓蓓-4': '白花',
  花葉蒂: '紅花',
  '花葉蒂-1': '橙花',
  '花葉蒂-2': '黃花',
  '花葉蒂-3': '藍花',
  '花葉蒂-4': '白花',
  '花葉蒂-5': 'Eternal',
  '花葉蒂-6': 'MEGA',
  花潔夫人: '紅花',
  '花潔夫人-1': '橙花',
  '花潔夫人-2': '黃花',
  '花潔夫人-3': '藍花',
  '花潔夫人-4': '白花',
  '多麗米亞-1': '心形',
  '多麗米亞-2': '星形',
  '多麗米亞-3': '菱形',
  '多麗米亞-4': '淑女',
  '多麗米亞-5': '貴婦',
  '多麗米亞-6': '紳士',
  '多麗米亞-7': '女王',
  '多麗米亞-8': '歌舞姬',
  '多麗米亞-9': '國王',
  超能妙喵: '雄性',
  '超能妙喵-1': '雌性',
  堅盾劍怪: '盾牌',
  '堅盾劍怪-1': '刀劍',
  '烏賊王-1': 'MEGA',
  '龜足巨鎧-1': 'MEGA',
  '毒藻龍-1': 'MEGA',
  '摔角鷹人-1': 'MEGA',
  '黏美兒-1': 'Hisui',
  '黏美龍-1': 'Hisui',
  南瓜精: '小顆種',
  '南瓜精-1': '中顆種',
  '南瓜精-2': '大顆種',
  '南瓜精-3': '巨顆種',
  南瓜怪人: '小顆種',
  '南瓜怪人-1': '中顆種',
  '南瓜怪人-2': '大顆種',
  '南瓜怪人-3': '巨顆種',
  '冰岩怪-1': 'Hisui',
  基格爾德: '50%',
  '基格爾德-1': '10%',
  '基格爾德-2': '',
  '基格爾德-3': '',
  '基格爾德-4': '完全體',
  '基格爾德-5': 'MEGA',
  '蒂安希-1': 'MEGA',
  '胡帕-1': 'MEGA',
  '老翁龍-1': 'MEGA',
  '列陣兵-1': 'MEGA',
};

/**
 * 合併三種語言的寶可夢資料
 * @param {string} zhFile - 中文資料文件路徑
 * @param {string} jaFile - 日文資料文件路徑
 * @param {string} enFile - 英文資料文件路徑
 * @returns {Promise<Array>} 合併後的寶可夢資料陣列
 */
async function mergeLanguageData(zhFile, jaFile, enFile) {
  try {
    // 讀取三個語言版本的資料
    const [zhData, jaData, enData, rowData, moveData] = await Promise.all([
      fs.readFile(zhFile, 'utf8').then(JSON.parse),
      fs.readFile(jaFile, 'utf8').then(JSON.parse),
      fs.readFile(enFile, 'utf8').then(JSON.parse),
      fs.readFile('data/personal_array.json', 'utf8').then(JSON.parse),
      fs.readFile('data/waza_array.json', 'utf8').then(JSON.parse),
    ]);

    console.log(
      `載入資料: 中文 ${zhData.length} 筆, 日文 ${jaData.length} 筆, 英文 ${enData.length} 筆`
    );

    const nameToPidMap = Object.fromEntries(
      rowData
        .map((item) => {
          return [
            [
              `${item.Name.zh}-${item.Info.Form}`,
              {
                pid: item.Info.SpeciesInternal,
                form: item.Info.Form,
              },
            ],
            [
              `${item.Name.zh}${item.Info.Form > 0 ? `-${item.Info.Form}` : ''}`,
              {
                pid: item.Info.SpeciesInternal,
                form: item.Info.Form,
              },
            ],
          ];
        })
        .flat()
    );

    const nameToFormMap = Object.fromEntries(
      rowData.map((item) => {
        return [`${item.Name.zh}-${item.Info.Form}`, item.Info.Form];
      })
    );

    const moveMap = Object.fromEntries(
      moveData.map((item) => {
        return [
          item.Name.zh,
          {
            id: item.MoveID,
            name: item.Name,
            type: TypeIdEnMap[item.Type] ?? item.Type,
            category: MoveCategoryMap[item.Category],
            power: item.Power,
            cooldown: item.Parameters.WazaRecastTime,
          },
        ];
      })
    );

    // 創建以 pid 為鍵的映射
    const zhMap = new Map();
    const jaMap = new Map();
    const enMap = new Map();

    const evolutionMap = new Map();
    const inverseEvolutionMap = new Map();

    zhData.forEach((pokemon) => zhMap.set(pokemon.pid, pokemon));
    jaData.forEach((pokemon) => jaMap.set(pokemon.pid, pokemon));
    enData.forEach((pokemon) => enMap.set(pokemon.pid, pokemon));

    // 獲取所有 pid
    const allPids = new Set([...zhMap.keys(), ...jaMap.keys(), ...enMap.keys()]);
    console.log(`總共找到 ${allPids.size} 個不同的寶可夢`);

    const mergedData = [];

    // 合併每個寶可夢的資料
    for (const pid of allPids) {
      const zhPokemon = zhMap.get(pid);
      const jaPokemon = jaMap.get(pid);
      const enPokemon = enMap.get(pid);

      // 以英文版本為基礎結構（通常最完整）
      const basePokemon = enPokemon || jaPokemon || zhPokemon;

      if (!basePokemon) {
        console.warn(`警告: 找不到 pid ${pid} 的資料`);
        continue;
      }

      // 創建合併後的寶可夢物件
      let mergedPokemon = {
        lumioseId: basePokemon.id,
        ...basePokemon,
      };
      delete mergedPokemon.id;

      // 合併多語言名稱
      mergedPokemon.name = createMultiLanguageField(
        zhPokemon?.name,
        jaPokemon?.name,
        enPokemon?.name
      );

      // 合併特性
      if (basePokemon.abilities) {
        mergedPokemon.abilities = mergeAbilitiesArray(
          zhPokemon?.abilities,
          jaPokemon?.abilities,
          enPokemon?.abilities
        );
      }

      // 合併隱藏特性
      if (basePokemon.abilitiyH) {
        mergedPokemon.abilitiyH = mergeAbilitiesArray(
          zhPokemon?.abilitiyH,
          jaPokemon?.abilitiyH,
          enPokemon?.abilitiyH
        );
      }

      // 合併屬性
      if (basePokemon.type) {
        mergedPokemon.type = enPokemon?.type;
      }

      // 合併Alpha招式
      if (basePokemon.alphaMove) {
        const move = moveMap[zhPokemon?.alphaMove];
        mergedPokemon.alphaMove = move;
      }

      // 合併等級招式
      if (basePokemon.levelUpMoves) {
        mergedPokemon.levelUpMoves = mergeMoveArray(
          zhPokemon?.levelUpMoves,
          jaPokemon?.levelUpMoves,
          enPokemon?.levelUpMoves,
          moveMap
        );
      }

      // 合併TM招式
      if (basePokemon.tmMoves) {
        mergedPokemon.tmMoves = mergeTMArray(
          zhPokemon?.tmMoves,
          jaPokemon?.tmMoves,
          enPokemon?.tmMoves,
          moveMap
        );
      }

      // 合併進化資訊
      if (basePokemon.evolution) {
        mergedPokemon.evolution = basePokemon.evolution
          .map((_, index) => {
            const zhEvo = zhPokemon?.evolution?.[index];
            const jaEvo = jaPokemon?.evolution?.[index];
            const enEvo = enPokemon?.evolution?.[index];

            const pid = nameToPidMap[zhEvo?.into];

            if (!pid) {
              console.warn(`警告: 找不到進化目標 ${zhEvo?.into} 的 pid`);
              return null;
            }

            const evolution = {
              //   pid: pid?.pid,
              //   form: pid?.form,
              link: `${pid?.pid}${pid?.form > 0 ? `-${pid?.form}` : ''}`,
              //   name: createMultiLanguageField(
              //     zhEvo?.into.replace(/-\d$/, ''),
              //     jaEvo?.into.replace(/-\d$/, ''),
              //     enEvo?.into.replace(/-\d$/, '')
              //   ),
              level: basePokemon.evolution[index].level,
              method: basePokemon.evolution[index].method,
            };

            if (zhEvo?.condition !== '0' && jaEvo?.condition !== '0' && enEvo?.condition !== '0') {
              evolution.condition = createMultiLanguageField(
                zhEvo?.condition,
                jaEvo?.condition,
                enEvo?.condition
              );
            }

            return evolution;
          })
          .filter(Boolean);
      }

      if (nameToPidMap[mergedPokemon.name.zh].pid != mergedPokemon.pid) {
        mergedPokemon.pid = nameToPidMap[mergedPokemon.name.zh].pid;
      }

      if (atlFormMap[mergedPokemon.name.zh] !== undefined) {
        mergedPokemon.altForm = atlFormMap[mergedPokemon.name.zh];

        if (mergedPokemon.altForm === '') {
          console.warn(`警告: 找不到寶可夢 ${mergedPokemon.name.zh} 的替代型態映射`);
        }
      }
      mergedPokemon.form = nameToFormMap[mergedPokemon.name.zh] || 0;

      mergedPokemon.name.zh = mergedPokemon.name.zh.replace(/-\d+$/, '');
      mergedPokemon.name.ja = mergedPokemon.name.ja.replace(/-\d+$/, '');
      mergedPokemon.name.en = mergedPokemon.name.en.replace(/-\d+$/, '');

      mergedPokemon = {
        pid: mergedPokemon.pid,
        form: mergedPokemon.form,
        lumioseId: mergedPokemon.lumioseId,
        altForm: mergedPokemon.altForm,
        link: `${mergedPokemon.pid}${mergedPokemon.form > 0 ? `-${mergedPokemon.form}` : ''}`,
        ...mergedPokemon,
      };

      evolutionMap.set(mergedPokemon.link, {
        link: mergedPokemon.link,
        type: mergedPokemon.type,
        name: mergedPokemon.name,
        altForm: mergedPokemon.altForm,
        to: [],
      });

      mergedData.push(mergedPokemon);
    }

    mergedData.forEach((pokemon) => {
      if (pokemon.evolution) {
        const from = evolutionMap.get(pokemon.link);
        pokemon.evolution.forEach((evo) => {
          const target = evolutionMap.get(evo.link);
          if (!target) {
            console.warn(from);
            console.warn(`警告: 找不到進化目標 ${evo.link} 的資料`);
            throw new Error(`找不到進化目標 ${evo.link} 的資料`);
          }

          target.level = evo.level;
          target.method = evo.method;
          target.condition = evo.condition;

          from.to.push(target);
          from.to.sort((a, b) => a.link.localeCompare(b.link));

          inverseEvolutionMap.set(evo.link, from.link);
        });
      }

      if (pokemon.altForm?.startsWith('MEGA')) {
        const from = evolutionMap.get(pokemon.link.replace(/-\d+$/, ''));
        const to = evolutionMap.get(pokemon.link);
        if (from && to) {
          to.level = 0;
          to.method = 'MegaEvolution';
          to.condition = {
            zh: `${from.name.zh}進化石`,
            ja: `${from.name.ja}ナイト`,
            en: `${from.name.en}ite`,
          };

          if (to.altForm === 'MEGA-X') {
            to.condition.zh = to.condition.zh + 'X';
            to.condition.ja = to.condition.ja + 'X';
            to.condition.en = to.condition.en + 'X';
          } else if (to.altForm === 'MEGA-Y') {
            to.condition.zh = to.condition.zh + 'Y';
            to.condition.ja = to.condition.ja + 'Y';
            to.condition.en = to.condition.en + 'Y';
          }

          from.to.push(to);
          from.to.sort((a, b) => a.link.localeCompare(b.link));

          inverseEvolutionMap.set(to.link, from.link);
        }
      }
    });

    mergedData.forEach((pokemon) => {
      let targetLink = pokemon.link;
      while (inverseEvolutionMap.has(targetLink)) {
        targetLink = inverseEvolutionMap.get(targetLink);
      }

      if (evolutionMap.has(targetLink)) {
        const evolution = evolutionMap.get(targetLink);
        if (evolution.to.length > 0) {
          pokemon.evolutionTree = evolution;
        }
      }

      pokemon.source = targetLink;

      // delete pokemon.evolution;
      // delete pokemon.levelUpMoves;
      // delete pokemon.tmMoves;
    });

    for (const evo of evolutionMap.values()) {
      if (evo.to.length === 0) {
        delete evo.to;
      }
    }

    // 依照 id 排序，特殊處理 718 和 718-1 的順序
    mergedData.sort((a, b) => {
      // 如果兩者都是 718 相關，讓 718-1 排在 718 前面
      if (a.link === '718' && b.link === '718-1') {
        return 1;
      }
      if (a.link === '718-1' && b.link === '718') {
        return -1;
      }
      // 其他情況依照原本的 lumioseId 排序
      return a.lumioseId - b.lumioseId;
    });

    console.log(`成功合併 ${mergedData.length} 筆寶可夢資料`);

    return mergedData;
  } catch (error) {
    console.error('合併資料時發生錯誤:', error);
    throw error;
  }
}

/**
 * 創建多語言欄位物件
 * @param {string} zh - 中文文本
 * @param {string} ja - 日文文本
 * @param {string} en - 英文文本
 * @returns {Object} 多語言物件
 */
function createMultiLanguageField(zh, ja, en) {
  const result = {};

  if (zh !== undefined && zh !== null) result.zh = zh;
  if (ja !== undefined && ja !== null) result.ja = ja;
  if (en !== undefined && en !== null) result.en = en;

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * 合併特性陣列
 * @param {Array} zhAbilities - 中文特性陣列
 * @param {Array} jaAbilities - 日文特性陣列
 * @param {Array} enAbilities - 英文特性陣列
 * @returns {Array} 合併後的特性陣列
 */
function mergeAbilitiesArray(zhAbilities, jaAbilities, enAbilities) {
  const baseArray = enAbilities || jaAbilities || zhAbilities || [];

  return baseArray
    .map((_, index) => {
      return createMultiLanguageField(
        zhAbilities?.[index],
        jaAbilities?.[index],
        enAbilities?.[index]
      );
    })
    .filter((ability) => ability !== null);
}

/**
 * 合併屬性陣列
 * @param {Array} zhTypes - 中文屬性陣列
 * @param {Array} jaTypes - 日文屬性陣列
 * @param {Array} enTypes - 英文屬性陣列
 * @returns {Array} 合併後的屬性陣列
 */
function mergeTypeArray(zhTypes, jaTypes, enTypes) {
  const baseArray = enTypes || jaTypes || zhTypes || [];

  return enTypes;
}

/**
 * 合併招式陣列
 * @param {Array} zhMoves - 中文招式陣列
 * @param {Array} jaMoves - 日文招式陣列
 * @param {Array} enMoves - 英文招式陣列
 * @returns {Array} 合併後的招式陣列
 */
function mergeMoveArray(zhMoves, jaMoves, enMoves, moveMap) {
  const baseMoves = enMoves || jaMoves || zhMoves || [];

  return baseMoves.map((baseMove, index) => {
    const zhMove = zhMoves?.[index];
    const move = moveMap[zhMove?.name];

    return {
      level: baseMove.level,
      plus: baseMove.plus,
      ...move,
    };
  });
}

/**
 * 合併TM招式陣列
 * @param {Array} zhTMs - 中文TM陣列
 * @param {Array} jaTMs - 日文TM陣列
 * @param {Array} enTMs - 英文TM陣列
 * @returns {Array} 合併後的TM陣列
 */
function mergeTMArray(zhTMs, jaTMs, enTMs, moveMap) {
  const baseTMs = enTMs || jaTMs || zhTMs || [];

  return baseTMs.map((baseTM, index) => {
    const zhTM = zhTMs?.[index];
    const move = moveMap[zhTM?.name];

    return {
      tm: baseTM.tm,
      ...move,
    };
  });
}

/**
 * 保存合併後的資料為JSON文件
 * @param {Array} mergedData - 合併後的資料
 * @param {string} outputPath - 輸出文件路徑
 */
async function saveToJSON(mergedData, outputPath) {
  try {
    let jsonString = '';
    if (outputPath.includes('personal_base.json')) {
      jsonString = JSON.stringify(mergedData);
    } else {
      jsonString = JSON.stringify(mergedData, null, 2);
    }

    // check if output directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(outputPath, jsonString, 'utf8');
    console.log(`成功保存合併資料到 ${outputPath}`);
  } catch (error) {
    console.error('保存JSON文件時發生錯誤:', error);
    throw error;
  }
}

/**
 * 主要執行函數
 * @param {string} zhFile - 中文資料文件路徑
 * @param {string} jaFile - 日文資料文件路徑
 * @param {string} enFile - 英文資料文件路徑
 * @param {string} outputFile - 輸出文件路徑（可選）
 */
async function main(zhFile, jaFile, enFile, outputFile, baseFile) {
  try {
    console.log('開始合併多語言寶可夢資料...');

    const mergedData = await mergeLanguageData(zhFile, jaFile, enFile);

    if (outputFile) {
      await saveToJSON(
        mergedData
          .filter((row) => row.lumioseId > 0)
          .filter((row) => !([664, 665].includes(row.pid) && row.link.includes('-')))
          .filter((row) => !['658-1', '718-2', '718-3'].includes(row.link)),
        outputFile
      );
    }

    if (baseFile) {
      const baseList = mergedData
        .filter((row) => row.lumioseId > 0)
        .filter((row) => !([664, 665].includes(row.pid) && row.link.includes('-')))
        .filter((row) => !['658-1', '718-2', '718-3'].includes(row.link))
        .map((row) => {
          const {
            levelUpMoves,
            tmMoves,
            form,
            alphaMove,
            eggGroup,
            expGroup,
            genderRatio,
            catchRate,
            height,
            weight,
            color,
            stage,
            abilities,
            abilitiyH,
            evolution,
            evolutionTree,
            ...rest
          } = row;
          return rest;
        });

      await saveToJSON(baseList, baseFile);
    }

    return mergedData;
  } catch (error) {
    console.error('合併過程中發生錯誤:', error);
    throw error;
  }
}

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('使用方法: node mergeLanguageData.js <中文文件> <日文文件> <英文文件> [輸出文件]');
    console.log(
      '範例: node mergeLanguageData.js data/personal_zh.json data/personal_ja.json data/personal_en.json data/personal_merged.json'
    );
    process.exit(1);
  }

  const version = '101';
  const zhFile = args[0];
  const jaFile = args[1];
  const enFile = args[2];
  const outputFile = args[3] || `data/${version}/personal.json`;
  const baseFile = `public/data/base_pm_list_${version}.json`;

  main(zhFile, jaFile, enFile, outputFile, baseFile)
    .then(() => {
      console.log('合併完成！');
    })
    .catch((error) => {
      console.error('執行失敗:', error);
      process.exit(1);
    });
}

export {
  createMultiLanguageField,
  main,
  mergeAbilitiesArray,
  mergeLanguageData,
  mergeMoveArray,
  mergeTMArray,
  mergeTypeArray,
  saveToJSON,
};
