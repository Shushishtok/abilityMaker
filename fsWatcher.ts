import * as fs from 'fs';
import { clearScreenDown } from 'readline';
import { AbilityCompiler } from './abilitymakerCompiler';
const watch = require("node-watch");

let completeData: {[path: string]: Array<AbilityKV>} = {};
const resourcePath = "node_modules/~kv/abilities";
const generatorPath = __dirname;

let watcher = watch([resourcePath, generatorPath + "/abilitymakerCompiler.js"], {recursive: true})
watcher.on("change", (eventType ?: 'update' | 'remove' | undefined, filePath ?: string) => {
	if (!filePath) return;
	if (filePath.includes("abilitymakerCompiler.js")) {
		compiler = loadCompiler();
	}
	let match = /(node_modules[\\/])?(.*[\/|\\](\w+)).js/g.exec(filePath);
	if (eventType == "update" && filePath && match) {
		const curpath = match[2];
		const data = getDataFromFile(curpath + ".js");
		if (data) {
			completeData[curpath] = data;
			combineData();
		}
	} else if (eventType == "remove" && match) {
		if (completeData.hasOwnProperty(match[2])) {
			delete completeData[match[2]];
			combineData();
		}
	}
})

// not really neccessarry:
watcher.on("error", (error: Error) => {
	console.log("\x1b[31m%s\x1b[0m", "Something went wrong!");
	console.log(error);
})

watcher.on("ready", () => {
	console.log("\x1b[32m%s\x1b[0m", "Ready!");
})

let compiler = loadCompiler();

function getDataFromFile(filePath: string):  Array<AbilityKV> | undefined {
	if (!fs.existsSync("node_modules/" + filePath)){
		return;
	}
	delete require.cache[require.resolve(filePath)]
	let file = require(filePath);
	if (file["GetAbilityData"]) {
		const abilityArr: Array<AbilityKV> = file["GetAbilityData"]();
		return abilityArr;
	}
	return;
}

function combineData() {
	compiler.OnAbilityDataChanged(completeData);
}

function loadCompiler(): AbilityCompiler
{
    // Clear require cache
    delete require.cache[require.resolve(generatorPath + "/abilitymakerCompiler")]
    // Require latest compiler version
    const compilerClass: new () => AbilityCompiler = require(generatorPath + "/abilitymakerCompiler").AbilityCompiler;
    return new compilerClass();
}
