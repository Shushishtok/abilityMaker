"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var child = __importStar(require("child_process"));
// define package insertions
var devScripts = [
    ["dev:abilitiesCompiler", "tsc --project node_modules/~kv/abilities/tsconfig.json"],
    ["dev:abilitiesCompilerWatcher", "tsc --project node_modules/~kv/abilities/tsconfig.json --watch"],
    ["dev:runAbilitiesWatcher", "node node_modules/@shushishtok/ability_generator/fsWatcher.js"],
    ["dev:abilitiesGeneratorWatcher", "tsc --project node_modules/@shushishtok/ability_generator/tsconfig.json"]
];
var initScripts = [
    "link-module-alias",
    "node node_modules/@shushishtok/ability_generator/init.js",
];
var aliases = [
    ["~kv", "scripts/npc"],
];
// Check package.json
function CheckPackage() {
    var e_1, _a;
    console.log("Searching for package.json...");
    var rootPath = "../../../";
    var scriptPath = "./";
    // adjust existing package.json
    if (fs.existsSync(rootPath + "package.json")) {
        console.log("Checking existing package.json...");
        var goalPackageRaw = fs.readFileSync(rootPath + "package.json");
        var goalPackage = JSON.parse(goalPackageRaw.toString());
        // check script part
        var hasDev = false;
        var hasInit = false;
        if (goalPackage.scripts) {
            var scripts = goalPackage.scripts;
            for (var name_1 in scripts) {
                if (name_1 == "dev") {
                    if (scripts[name_1] !== "run-p dev:*") {
                        console.log("\x1b[31m%s\x1b[0m", "Unexpected 'dev' script in package.json!");
                        return;
                    }
                    hasDev = true;
                }
                if (name_1 == "init") {
                    hasInit = true;
                }
            }
        }
        else {
            goalPackage.scripts = {};
        }
        if (!hasDev) {
            goalPackage.scripts["dev"] = "run-p dev:*";
        }
        try {
            for (var devScripts_1 = __values(devScripts), devScripts_1_1 = devScripts_1.next(); !devScripts_1_1.done; devScripts_1_1 = devScripts_1.next()) {
                var _b = __read(devScripts_1_1.value, 2), name_2 = _b[0], cmd = _b[1];
                goalPackage.scripts[name_2] = cmd;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (devScripts_1_1 && !devScripts_1_1.done && (_a = devScripts_1.return)) _a.call(devScripts_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var init = "";
        if (!hasInit) {
            init = "link-module-alias && node node_modules/@shushishtok/ability_generator/init.js";
        }
        else {
            var splits = goalPackage.scripts["init"].split(" && ");
            for (var index = 0; index < initScripts.length; index++) {
                var entry = initScripts[index];
                if (!splits.includes(entry)) {
                    splits.push(entry);
                }
            }
            delete goalPackage.scripts["init"];
            init = splits.join(" && ");
        }
        // check module aliases
        var packageAliases = [];
        if (goalPackage._moduleAliases) {
            for (var name_3 in goalPackage._moduleAliases) {
                packageAliases.push(name_3);
            }
        }
        else {
            goalPackage._moduleAliases = {};
        }
        for (var index = 0; index < aliases.length; index++) {
            var newAlias = aliases[index];
            if (!packageAliases.includes(newAlias[0])) {
                goalPackage._moduleAliases[newAlias[0]] = newAlias[1];
            }
        }
        var origPackagePath = scriptPath + "_package.json";
        if (fs.existsSync(origPackagePath)) {
            var origPackageRaw = fs.readFileSync(origPackagePath);
            var origPackage = JSON.parse(origPackageRaw.toString());
            if (!goalPackage.dependencies) {
                goalPackage.dependencies = {};
            }
            if (!goalPackage.devDependencies) {
                goalPackage.devDependencies = {};
            }
            origPackage.dependencies["@shushishtok/ability_generator"] = "latest";
            for (var name_4 in origPackage.devDependencies) {
                if (!goalPackage.devDependencies.hasOwnProperty(name_4) && !goalPackage.dependencies.hasOwnProperty(name_4)) {
                    goalPackage.devDependencies[name_4] = origPackage.devDependencies[name_4];
                }
            }
            for (var name_5 in origPackage.dependencies) {
                if (!goalPackage.dependencies.hasOwnProperty(name_5) && !goalPackage.devDependencies.hasOwnProperty(name_5)) {
                    goalPackage.dependencies[name_5] = origPackage.dependencies[name_5];
                }
            }
        }
        goalPackage.scripts["init"] = init;
        console.log("Creating backup of package.json...");
        fs.copyFileSync(rootPath + "package.json", rootPath + "backup_package.json");
        console.log("Adjusting package.json...");
        var data = JSON.stringify(goalPackage, undefined, 2);
        fs.writeFileSync(rootPath + "package.json", data);
        // copy the default package.json if there wasn't any previously
    }
    else {
        var copyPackage = scriptPath + "_package.json";
        if (fs.existsSync(copyPackage)) {
            console.log("Copying new package.json");
            fs.copyFileSync(copyPackage, rootPath + "package.json");
        }
        else {
            console.log("\x1b[31m%s\x1b[0m", "\nCouldn't find _package.json! Have you installed this module correctly?");
            return;
        }
    }
    console.log("Running final installation, please wait for the success message...");
    child.exec("npm install", {
        cwd: rootPath,
    }, function (err, stdout) {
        if (err) {
            console.log("\x1b[31m%s\x1b[0m", "Something went wrong...\n\n");
            console.log(err);
        }
        else {
            console.log("\x1b[32m%s\x1b[0m", "package.json adjustments successful!");
        }
    });
}
CheckPackage();
