const fs = require('fs').promises;
const path = require('path');

async function readNames(language, type) {
  // Construct the path to the type.txt file based on language and type
  const typePath = path.join(__dirname, '..', 'za-textport', language, `${type}.txt`);
  try {
    const text = await fs.readFile(typePath, 'utf8');
    return text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  } catch (e) {
    // If unable to read type file, return empty array and warn
    console.warn(
      `Warning: Unable to read ${type}.txt, will skip name annotation ->`,
      e.message || e
    );
    return [];
  }
}

module.exports = { readNames };
