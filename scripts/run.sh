# parse multilanguage personal.txt files into json
node scripts/pokemonDataParser.js za-textport/Trad_Chinese/personal.txt data/personal_zh.json
node scripts/pokemonDataParser.js za-textport/English/personal.txt data/personal_en.json
node scripts/pokemonDataParser.js za-textport/JPN/personal.txt data/personal_ja.json

# run ETL processes
node scripts/ETL.js
node scripts/ETLMove.js

# merge multilanguage personal json files
node scripts/mergeData.js data/personal_zh.json data/personal_ja.json data/personal_en.json