import fs from 'fs';
import path from 'path';

// 路徑設定
const JSON_FILE_PATH = 'public/data/base_pm_list_101.json';
const SOURCE_ICON_DIR = '/Users/shihchi/Desktop/ZA/Pokemon Icons';
const DEST_ICON_DIR = 'public/images/pmIcon';

const fixLinkMap = {};
fixLinkMap['661'] = '753';
fixLinkMap['662'] = '754';
fixLinkMap['663'] = '755';
fixLinkMap['659'] = '711';
fixLinkMap['660'] = '712';
fixLinkMap['664'] = '706';
fixLinkMap['665'] = '707';
fixLinkMap['666'] = '708';
for (let i = 1; i <= 19; i++) {
  fixLinkMap[`666-${i}`] = `708-${i}`;
}
fixLinkMap['688'] = '747';
fixLinkMap['689'] = '748';
fixLinkMap['689-1'] = '748-1';

fixLinkMap['669'] = '713';
for (let i = 1; i <= 4; i++) {
  fixLinkMap[`669-${i}`] = `713-${i}`;
}
fixLinkMap['670'] = '714';
for (let i = 1; i <= 6; i++) {
  fixLinkMap[`670-${i}`] = `714-${i}`;
}
fixLinkMap['671'] = '715';
for (let i = 1; i <= 4; i++) {
  fixLinkMap[`671-${i}`] = `715-${i}`;
}

fixLinkMap['672'] = '728';
fixLinkMap['673'] = '729';
fixLinkMap['677'] = '733';
fixLinkMap['678'] = '734';
fixLinkMap['678-1'] = '734-1';

fixLinkMap['667'] = '704';
fixLinkMap['668'] = '705';
fixLinkMap['668-1'] = '705-1';
fixLinkMap['674'] = '752';
fixLinkMap['675'] = '730';
fixLinkMap['702'] = '741';

fixLinkMap['679'] = '744';
fixLinkMap['680'] = '745';
fixLinkMap['681'] = '746';
fixLinkMap['681-1'] = '746-1';

fixLinkMap['682'] = '758';
fixLinkMap['683'] = '759';
fixLinkMap['684'] = '742';
fixLinkMap['685'] = '743';

fixLinkMap['700'] = '767';
fixLinkMap['703'] = '766';

fixLinkMap['676'] = '701';
for (let i = 1; i <= 9; i++) {
  fixLinkMap[`676-${i}`] = `701-${i}`;
}

fixLinkMap['686'] = '726';
fixLinkMap['687'] = '727';
fixLinkMap['687-1'] = '727-1';

fixLinkMap['690'] = '709';
fixLinkMap['691'] = '710';
fixLinkMap['691-1'] = '710-1';

fixLinkMap['692'] = '756';
fixLinkMap['693'] = '757';

fixLinkMap['704'] = '763';
fixLinkMap['705'] = '764';
fixLinkMap['705-1'] = '764-1';
fixLinkMap['706'] = '765';
fixLinkMap['706-1'] = '765-1';

fixLinkMap['712'] = '749';
fixLinkMap['713'] = '751';
fixLinkMap['713-1'] = '751-1';

fixLinkMap['701'] = '761';
fixLinkMap['701-1'] = '761-1';

fixLinkMap['708'] = '702';
fixLinkMap['709'] = '703';

fixLinkMap['714'] = '716';
fixLinkMap['715'] = '762';

fixLinkMap['707'] = '760';

fixLinkMap['696'] = '737';
fixLinkMap['697'] = '738';
fixLinkMap['698'] = '739';
fixLinkMap['699'] = '740';

fixLinkMap['694'] = '731';
fixLinkMap['695'] = '732';

fixLinkMap['710'] = '735';
for (let i = 1; i <= 3; i++) {
  fixLinkMap[`710-${i}`] = `735-${i}`;
}
fixLinkMap['711'] = '736';
for (let i = 1; i <= 3; i++) {
  fixLinkMap[`711-${i}`] = `736-${i}`;
}

fixLinkMap['656'] = '723';
fixLinkMap['657'] = '724';
fixLinkMap['658'] = '725';
fixLinkMap['658-3'] = '725-3';

fixLinkMap['870'] = '923';
fixLinkMap['870-1'] = '923-1';

fixLinkMap['650'] = '720';
fixLinkMap['651'] = '721';
fixLinkMap['652'] = '722';
fixLinkMap['652-1'] = '722-1';

fixLinkMap['653'] = '717';
fixLinkMap['654'] = '718';
fixLinkMap['655'] = '719';
fixLinkMap['655-1'] = '719-1';

fixLinkMap['780'] = '856';
fixLinkMap['780-1'] = '856-1';

fixLinkMap['716'] = '768';
fixLinkMap['717'] = '769';

fixLinkMap['718'] = '770';
for (let i = 1; i <= 5; i++) {
  fixLinkMap[`718-${i}`] = `770-${i}`;
}

fixLinkMap['719'] = '772';
fixLinkMap['719-1'] = '772-1';

/**
 * 清空目標資料夾中的所有檔案
 */
function clearDestinationDirectory() {
  if (fs.existsSync(DEST_ICON_DIR)) {
    const files = fs.readdirSync(DEST_ICON_DIR);
    files.forEach((file) => {
      const filePath = path.join(DEST_ICON_DIR, file);
      fs.unlinkSync(filePath);
      console.log(`已刪除: ${file}`);
    });
    console.log(`已清空目標資料夾: ${DEST_ICON_DIR}`);
  } else {
    // 如果資料夾不存在，建立它
    fs.mkdirSync(DEST_ICON_DIR, { recursive: true });
    console.log(`已建立目標資料夾: ${DEST_ICON_DIR}`);
  }
}

/**
 * 根據 link 值構建來源檔案名稱
 */
function buildSourceFileName(link, altForm = null) {
  // 將 link 轉為數字後補零到4位數
  const paddedLink = link.toString().padStart(4, '0');

  // 如果是 MEGA 形態，優先使用 _51_00_00_0 檔案
  if (altForm && altForm.startsWith('MEGA')) {
    const prefix = paddedLink.split('-')[0].padStart(4, '0');
    if (!altForm.startsWith('MEGA-Y')) {
      return `pm${prefix}_51_00_00_0.png`;
    } else {
      return `pm${prefix}_52_00_00_0.png`;
    }
  }

  return `pm${paddedLink}_00_00_00_0.png`;
}

/**
 * 尋找替代的來源檔案
 * @param {string} link - Pokemon link 值
 * @param {Set} usedFiles - 已使用的檔案集合
 * @param {string} sourceDir - 來源資料夾路徑
 * @returns {string|null} - 找到的檔案名稱或 null
 */
function findAlternativeSourceFile(link, usedFiles, sourceDir) {
  try {
    // 取得基本的 link 數字部分（去掉 -1, -2 等後綴）
    const baseLinkNumber = link.split('-')[0];
    const paddedBaseLink = baseLinkNumber.padStart(4, '0');

    // 列出所有檔案
    const allFiles = fs.readdirSync(sourceDir);

    // 找出符合 pm[LINK]_ 開頭的檔案
    const matchingFiles = allFiles.filter((file) => {
      return file.startsWith(`pm${paddedBaseLink}_`) && file.endsWith('.png');
    });

    if (matchingFiles.length > 0) {
      console.log(
        `🔍 找到 ${matchingFiles.length} 個符合 pm${paddedBaseLink}_ 的檔案:`,
        matchingFiles.join(', ')
      );
    }

    // 篩選出不以 _1 結尾的檔案（排除 _1.png）
    const validFiles = matchingFiles.filter((file) => {
      const nameWithoutExt = file.replace('.png', '');
      return !nameWithoutExt.endsWith('_1') && !usedFiles.has(file);
    });

    if (validFiles.length > 0) {
      console.log(`📋 可用的檔案 (排除 _1 結尾和已使用):`, validFiles.join(', '));
      // 返回第一個可用的檔案
      return validFiles[0];
    }

    return null;
  } catch (error) {
    console.error(`尋找替代檔案時發生錯誤: ${error.message}`);
    return null;
  }
}

/**
 * 根據 link 值構建目標檔案名稱
 */
function buildDestFileName(link) {
  return `${link}.png`;
}

/**
 * 複製並重新命名檔案
 */
function copyAndRenameFile(sourceFilePath, destFilePath, link) {
  try {
    fs.copyFileSync(sourceFilePath, destFilePath);
    fs.copyFileSync(
      sourceFilePath.replace('0.png', '1.png'),
      destFilePath.replace('.png', 's.png')
    );
    // console.log(`✅ 成功複製: ${link}.png`);
    return true;
  } catch (error) {
    console.error(`❌ 複製失敗 (link: ${link}): ${error.message}`);
    return false;
  }
}

/**
 * 主要處理函式
 */
function processPokemonIcons() {
  try {
    // 1. 清空目標資料夾
    console.log('=== 開始清空目標資料夾 ===');
    clearDestinationDirectory();

    // 2. 讀取 JSON 檔案
    console.log('\n=== 讀取 JSON 檔案 ===');
    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE_PATH, 'utf8'));
    console.log(`已讀取 ${jsonData.length} 筆資料`);

    // 3. 檢查來源資料夾是否存在
    if (!fs.existsSync(SOURCE_ICON_DIR)) {
      throw new Error(`來源資料夾不存在: ${SOURCE_ICON_DIR}`);
    }

    // 4. 處理每一筆資料
    console.log('\n=== 開始處理圖示檔案 ===');
    let successCount = 0;
    let failCount = 0;
    let fallbackCount = 0;
    const processedLinks = new Set(); // 避免重複處理相同的 link
    const usedFiles = new Set(); // 追蹤已使用的檔案

    jsonData.forEach((pokemon, index) => {
      const link = pokemon.link;
      const altForm = pokemon.altForm;

      // 跳過已處理過的 link
      if (processedLinks.has(link)) {
        return;
      }
      processedLinks.add(link);

      // console.log(`\n處理中 (${index + 1}/${jsonData.length}): ${pokemon.name.zh} (link: ${link})`);

      // 修正特例 link
      const fixedLink = fixLinkMap[link] || link;

      // 構建檔案路徑
      const sourceFileName = buildSourceFileName(fixedLink, altForm);
      const sourceFilePath = path.join(SOURCE_ICON_DIR, sourceFileName);
      const destFileName = buildDestFileName(link);
      const destFilePath = path.join(DEST_ICON_DIR, destFileName);

      let actualSourceFile = sourceFileName;
      let actualSourcePath = sourceFilePath;

      // 檢查來源檔案是否存在
      if (fs.existsSync(sourceFilePath)) {
        // 直接使用原始檔案
        usedFiles.add(sourceFileName);
        if (copyAndRenameFile(sourceFilePath, destFilePath, link)) {
          // console.log(`✅ 成功複製 (原始檔案): pm${link}.png`);
          successCount++;
        } else {
          failCount++;
        }
      } else {
        console.log(`⚠️  找不到來源檔案: ${sourceFileName} (link: ${link})`);

        // 嘗試尋找替代檔案
        const alternativeFile = findAlternativeSourceFile(fixedLink, usedFiles, SOURCE_ICON_DIR);
        if (alternativeFile) {
          actualSourceFile = alternativeFile;
          actualSourcePath = path.join(SOURCE_ICON_DIR, alternativeFile);
          usedFiles.add(alternativeFile);

          if (copyAndRenameFile(actualSourcePath, destFilePath, link)) {
            // console.log(`✅ 成功複製 (替代檔案 ${alternativeFile}): pm${link}.png`);
            successCount++;
            fallbackCount++;
          } else {
            failCount++;
          }
        } else {
          console.log(`❌ 無法找到適合的替代檔案 (link: ${link})`);
          failCount++;
        }
      }
    });

    // 5. 顯示處理結果
    console.log('\n=== 處理完成 ===');
    console.log(`成功: ${successCount} 個檔案`);
    console.log(`失敗: ${failCount} 個檔案`);
    console.log(`使用替代檔案: ${fallbackCount} 個檔案`);
    console.log(`總共處理: ${processedLinks.size} 個不重複的 link`);
  } catch (error) {
    console.error('處理過程中發生錯誤:', error.message);
    process.exit(1);
  }
}

// 執行主程式
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  processPokemonIcons();
}

export { processPokemonIcons };
