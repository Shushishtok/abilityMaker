import * as fs from 'fs';

function copyFiles() {
	console.log("Copying initial files...");
	const resourcePath = "node_modules/~kv";
	let dirPath = __dirname + "/abilities";
	if (fs.existsSync(dirPath) && fs.existsSync(resourcePath)) {
		let resultPath = resourcePath + "/abilities";
		if (!fs.existsSync(resultPath)) {
			fs.mkdirSync(resultPath);
		}
		if (!fs.existsSync(resultPath + "/abilityData.ts")) {
			fs.copyFileSync(dirPath + "/abilityData.ts", resultPath + "/abilityData.ts");
		}
		if (!fs.existsSync(resultPath + "/abilityData.js")) {
			fs.copyFileSync(dirPath + "/abilityData.js", resultPath + "/abilityData.js");
		}
		if (!fs.existsSync(resultPath + "/tsconfig.json")) {
			fs.copyFileSync(dirPath + "/tsconfig.json", resultPath + "/tsconfig.json");
		}
	}
	console.log("\x1b[36m%s\x1b[0m", "Finished copy process!");
}

copyFiles();