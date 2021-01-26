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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
function copyFiles() {
    console.log("Copying initial files...");
    var resourcePath = "node_modules/~kv";
    var dirPath = __dirname + "/abilities";
    if (fs.existsSync(dirPath) && fs.existsSync(resourcePath)) {
        var resultPath = resourcePath + "/abilities";
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
