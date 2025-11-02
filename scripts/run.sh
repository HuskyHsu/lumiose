node scripts/pokemonDataParser.js za-textport/Trad_Chinese/personal.txt data/personal_zh.json
node scripts/pokemonDataParser.js za-textport/English/personal.txt data/personal_en.json
node scripts/pokemonDataParser.js za-textport/JPN/personal.txt data/personal_ja.json

node scripts/ETL.js
node scripts/mergeLanguageData.js data/personal_zh.json data/personal_ja.json data/personal_en.json