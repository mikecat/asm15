"use strict";

// This file is for using asm15 from Node.js

async function readAllFromStream(readable) {
	let result = "";
	return new Promise((resolve, reject) => {
		/*
		const readableHandler = () => {
			const dataRead = readable.read();
			if (dataRead !== null) {
				result += dataRead;
				readable.once("readable", readableHandler);
			}
		};
		readable.once("readable", readableHandler);
		*/
		readable.on("data", (chunk) => result += chunk);
		readable.once("end", () => resolve(result));
		readable.once("error", (error) => reject(error));
	});
}

async function writeToStream(writable, data) {
	if (!writable.write(data)) {
		return new Promise((resolve) => {
			writable.once("drain", () => resolve());
		});
	}
}

const options = {};
let inputFile = null;
let outputFile = null;
let inputEncoding = "utf8";
let outputEncoding = "utf8";
let outputFormat = "bas16";
let startAddress = "0x700";
let useLineno = true;
let linenoStart = "10";
let linenoDelta = "10";
let showSize = false;
let help = false;
let formatHelp = false;

for (let i = 2; i < process.argv.length; i++) {
	switch (process.argv[i]) {
		case "-i": case "--input-file":
			inputFile = process.argv[++i];
			break;
		case "-o": case "--output-file":
			outputFile = process.argv[++i];
			break;
		case "--input-encoding":
			inputEncoding = process.argv[++i];
			break;
		case "--output-encoding":
			outputEncoding = process.argv[++i];
			break;
		case "-f": case "--output-format":
			outputFormat = process.argv[++i];
			break;
		case "-s": case "--start-address":
			startAddress = process.argv[++i];
			break;
		case "--lineno":
			useLineno = true;
			break;
		case "--no-lineno":
			useLineno = false;
			break;
		case "--lineno-start":
			linenoStart = process.argv[++i];
			break;
		case "--lineno-delta":
			linenoDelta = process.argv[++i];
			break;
		case "--show-size":
			showSize = true;
			break;
		case "--no-show-size":
			showSize = false;
			break;
		case "-h": case "--help":
			help = true;
			break;
		case "--format-help":
			formatHelp = true;
			break;
	}
	if (i >= process.argv.length) {
		throw new Error("an option is used without required parameter");
	}
}

(async () => {
	if (help) {
		await writeToStream(process.stdout, `Usage: node asm15node.js [options]

options:
-i <file> / --input-file <file>    : set file to read from  (default: stdin)
-o <file> / --output-file <file>   : set file to write to   (default: stdout)
--input-encoding <encoding>        : set charset for input  (default: utf8)
--output-encoding <encoding>       : set charset for output (default: utf8)
-f <id>   / --output-format <id>   : set output format      (default: bas16)
-s <addr> / --start-address <addr> : set start address      (default: 0x700)
--lineno                           : output line numbers    (default)
--no-lineno                        : don't output line numbers
--lineno-start <value>             : set the first line number   (default: 10)
--lineno-delta <value>             : set interval of line number (default: 10)
--show-size                        : show result size on stderr
--no-show-size                     : don't show result size on stderr (default)
-h        / --help                 : show this usage information
--format-help                      : show list of available output format ids
`);
	}

	if (formatHelp) {
		if (help) await writeToStream(process.stdout, "\n");
		await writeToStream(process.stdout, "available output format ids:\n");
		const { fmt_dict } = require("./asm15output.js");
		await writeToStream(process.stdout, Object.keys(fmt_dict).join("\n") + "\n");
	}

	if (!help && !formatHelp) {
		const fs = require("node:fs");
		const { assemble } = require("./asm15.js");
		const inputStream = inputFile === null ? process.stdin : fs.createReadStream(inputFile);
		const outputStream = outputFile === null ? process.stdout : fs.createWriteStream(outputFile);
		inputStream.setEncoding(inputEncoding);
		outputStream.setDefaultEncoding(outputEncoding);
		process.stderr.setDefaultEncoding(outputEncoding);
		const sourceCode = await readAllFromStream(inputStream);
		const result = assemble(sourceCode, outputFormat, {
			startAddress,
			useLineno,
			linenoStart,
			linenoDelta,
		});
		if (showSize) {
			await writeToStream(process.stderr, "size " + result.size + "\n");
			if (result.errors.length > 0) await writeToStream(process.stderr, "\n");
		}
		if (result.errors.length > 0) {
			await writeToStream(process.stderr, result.errors.join("\n\n") + "\n");
			process.exitCode = 1;
		}
		await writeToStream(outputStream, result.bas instanceof ArrayBuffer ? new Uint8Array(result.bas) : result.bas);
	}
})();
