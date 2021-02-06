import * as fs from 'fs';
import * as child from 'child_process';

interface packageSnippet {
	scripts?: {[name: string]: string};
	_moduleAliases?: {[name: string]: string};
	dependencies?: {[name: string]: string};
	devDependencies?: {[name: string]: string};
}

// define package insertions
const devScripts = [
	["dev:DotaKVCompiler", "tsc --project node_modules/~kv/dota-kv/tsconfig.json"],
    ["dev:DotaKVCompilerWatcher", "tsc --project node_modules/~kv/dota-kv/tsconfig.json --watch"],
	["dev:runDotaKVWatcher", "node node_modules/@shushishtok/dota-kv-maker/fsWatcher.js"],
	["dev:DotaKVGeneratorWatcher", "tsc --project node_modules/@shushishtok/dota-kv-maker/tsconfig.json"]
]
const initScripts = [
	"link-module-alias",
	"node node_modules/@shushishtok/dota-kv-maker/init.js",
]
const aliases = [
	["~kv", "scripts/npc"],
]

// Check package.json
function CheckPackage() {
	console.log("Searching for package.json...");
	const rootPath = "../../../";
	const scriptPath = "./";

	// adjust existing package.json
	if (fs.existsSync(rootPath + "package.json")) {
		console.log("Checking existing package.json...")
		const goalPackageRaw = fs.readFileSync(rootPath + "package.json");
		const goalPackage = JSON.parse(goalPackageRaw.toString()) as packageSnippet;

		// check script part
		let hasDev = false;
		let hasInit = false;
		if (goalPackage.scripts) {
			let scripts = goalPackage.scripts;
			for (const name in scripts) {
				if (name == "dev") {
					if (scripts[name] !== "run-p dev:*") {
						console.log("\x1b[31m%s\x1b[0m", "Unexpected 'dev' script in package.json!");
						return;
					}
					hasDev = true;
				}
				if (name == "init") {
					hasInit = true;
				}
			}
		} else {
			goalPackage.scripts = {};
		}
		if (!hasDev) {
			goalPackage.scripts["dev"] = "run-p dev:*";
		}
		for (const [name, cmd] of devScripts) {
			goalPackage.scripts[name] = cmd;
		}
		let init: string = "";
		if (!hasInit) {
			init = "link-module-alias && node node_modules/@shushishtok/ability_generator/init.js";
		} else {
			let splits = goalPackage.scripts["init"]!.split(" && ");
			for (let index = 0; index < initScripts.length; index++) {
				let entry = initScripts[index];
				if (!splits.includes(entry)) {
					splits.push(entry);
				}
			}
			delete goalPackage.scripts["init"];
			init = splits.join(" && ");
		}

		// check module aliases
		let packageAliases: string[] = []
		if (goalPackage._moduleAliases) {
			for (const name in goalPackage._moduleAliases) {
				packageAliases.push(name);
			}
		} else {
			goalPackage._moduleAliases = {};
		}
		for (let index = 0; index < aliases.length; index++) {
			let newAlias = aliases[index];
			if (!packageAliases.includes(newAlias[0])) {
				goalPackage._moduleAliases[newAlias[0]] = newAlias[1];
			}
		}

		const origPackagePath = scriptPath + "_package.json";
		if (fs.existsSync(origPackagePath)) {
			const origPackageRaw = fs.readFileSync(origPackagePath);
			const origPackage = JSON.parse(origPackageRaw.toString()) as packageSnippet;

			if (!goalPackage.dependencies) {
				goalPackage.dependencies = {};
			}
			if (!goalPackage.devDependencies) {
				goalPackage.devDependencies = {};
			}
			origPackage.dependencies!["@shushishtok/dota-kv-maker"] = "latest"

			for (const name in origPackage.devDependencies!) {
				if (!goalPackage.devDependencies.hasOwnProperty(name) && !goalPackage.dependencies.hasOwnProperty(name)) {
					goalPackage.devDependencies[name] = origPackage.devDependencies[name];
				}
			}
			for (const name in origPackage.dependencies!) {
				if (!goalPackage.dependencies.hasOwnProperty(name) && !goalPackage.devDependencies.hasOwnProperty(name)) {
					goalPackage.dependencies[name] = origPackage.dependencies[name];
				}
			}
		}

		goalPackage.scripts["init"] = init;

		console.log("Creating backup of package.json...");
		fs.copyFileSync(rootPath + "package.json", rootPath + "backup_package.json");
		console.log("Adjusting package.json...");
		let data = JSON.stringify(goalPackage, undefined, 2);
		fs.writeFileSync(rootPath + "package.json", data);

	// copy the default package.json if there wasn't any previously
	} else {
		const copyPackage = scriptPath + "_package.json";
		if (fs.existsSync(copyPackage)) {
			console.log("Copying new package.json");
			fs.copyFileSync(copyPackage, rootPath + "package.json");
		} else {
			console.log("\x1b[31m%s\x1b[0m", "\nCouldn't find _package.json! Have you installed this module correctly?")
			return;
		}
	}
	console.log("Running final installation, please wait for the success message...")
	child.exec("npm install", {
		cwd: rootPath,
	}, (err, stdout) => {
		if (err) {
			console.log("\x1b[31m%s\x1b[0m", "Something went wrong...\n\n");
			console.log(err);
		} else {
			console.log("\x1b[32m%s\x1b[0m", "package.json adjustments successful!");
		}
	})
}

CheckPackage();