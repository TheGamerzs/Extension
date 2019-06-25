"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_sass_1 = require("node-sass");
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
//* Clear old output
console.clear();
var filesToCompile = require("./sassFiles.json");
filesToCompile.map(async (f) => {
    var reqFiles = await compileFile(f.file, f.outFile);
    reqFiles.stats.includedFiles.map(file => fs_1.watchFile(file, () => {
        console.clear();
        compileFile(f.file, f.outFile);
    }));
});
function compileFile(file, outFile) {
    return new Promise(async (resolve, reject) => {
        await node_sass_1.render({
            file: file,
            outFile: outFile,
            outputStyle: "compressed"
        }, (err, res) => {
            if (err) {
                // @ts-ignore Ignore as .d.ts file is incorrect
                console.log(chalk_1.default.red(err.formatted));
                return;
            }
            fs_1.writeFile(outFile, res.css, err => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                console.log(chalk_1.default.green(`${new Date().toLocaleTimeString()} Compiled ${path_1.basename(file)}`));
                resolve(res);
            });
        });
    });
}
