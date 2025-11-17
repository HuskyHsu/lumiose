// scripts/filter_personal_array.js
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readNames } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const inputPath = path.join(__dirname, '..', 'za-textport', 'Raw', 'waza_array.json');
  const outDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(outDir, 'waza_array.json');

  const inputParamPath = path.join(__dirname, '..', 'za-textport', 'Raw', 'waza_param_array.json');

  const [zhMoves, jaMoves, enMoves] = await Promise.all([
    readNames('Trad_Chinese', 'moves'),
    readNames('JPN', 'moves'),
    readNames('English', 'moves'),
  ]);

  // console.log(zhMoves.length);
  // console.log(jaMoves.length);
  // console.log(enMoves.length);

  const zipMoveNames = (idx) => {
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

    // Read and parse raw parameter array
    const paramText = await fs.readFile(inputParamPath, 'utf8');
    const paramParsed = JSON.parse(paramText);
    const paramArr = paramParsed.Table.map((item) => item.Table).flat();

    // paramArr.slice(1, 5).forEach((item, index) => {
    //   console.log(`Param ${index}:`, item);
    // });

    let moveList = arr
      .filter((item) => item.CanUseMove !== false)
      .map((item) => {
        const param = paramArr.find((param) => param.WazaId === item.MoveID);

        return {
          MoveID: item.MoveID,
          Name: zipMoveNames(item.MoveID),
          ...item,
          Parameters: param || {},
        };
      });

    await fs.writeFile(outputPath, JSON.stringify(moveList, null, 2), 'utf8');

    console.log(`Complete: wrote ${moveList.length} items to ${outputPath}`);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
