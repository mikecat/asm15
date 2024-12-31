"use strict";

function parseBasInt(s) {
	if (s.substr(0, 1) === "#") return parseInt(s.substr(1), 16);
	else if (s.substr(0, 1) === "`") return parseInt(s.substr(1), 2);
	else return parseInt(s, 10);
}

function readMachineCode(codeStr) {
	const s = codeStr.split("\n");
	let n = 0;

	const memWrites = [];
	for (let i = 0; i < s.length; i++) {
		let basCode = s[i].replace(/\s/g, ""); // erase spaces
		basCode = basCode.replace(/^\d+/, ""); // erase line number
		basCode = basCode.replace(/'.*$/, ""); // erase comment
		const basCodes = basCode.split(":");
		let basValid = false;
		let matched;
		for (let j = 0; j < basCodes.length; j++) {
			const code = basCodes[j];
			if ((matched = /^poke(#[0-9a-fA-F]+|[0-9]+|`[01]+),/i.exec(code))) {
				let addr = parseBasInt(matched[1]);
				const data = code.split(",");
				for (let k = 1; k < data.length; k++) {
					memWrites.push([addr, parseBasInt(data[k]), "poke"]);
					addr++;
				}
				basValid = true;
			} else if ((matched = /^\[(#[0-9a-fA-F]+|[0-9]+|`[01]+)\]=(#[0-9a-fA-F]+|[0-9]+|`[01]+)$/i.exec(code))) {
				const idx = parseBasInt(matched[1]);
				const value = parseBasInt(matched[2]);
				memWrites.push([0x800 + idx * 2, value & 0xff, "array"]);
				memWrites.push([0x800 + idx * 2 + 1, (value >> 8) & 0xff, "array"]);
				basValid = true;
			} else if ((matched = /^let\[(#[0-9a-fA-F]+|[0-9]+|`[01]+)\],/i.exec(code))) {
				let idx = parseBasInt(matched[1]);
				const data = code.split(",");
				for (let k = 1; k < data.length; k++) {
					const value = parseBasInt(data[k]);
					memWrites.push([0x800 + idx * 2, value & 0xff, "array"]);
					memWrites.push([0x800 + idx * 2 + 1, (value >> 8) & 0xff, "array"]);
					idx++;
				}
				basValid = true;
			}
		}

		if (!basValid) {
			if ((matched = /^\*\*\* (-?[0-9]+)-byte gap \*\*\*$/.exec(s[i]))) {
				n += parseInt(matched[1]) >> 1;
			} else {
				const binCode = s[i].replace(/[^01]/g, "");
				if (binCode.length == 16) {
					const binValue = parseInt(binCode, 2);
					memWrites.push([n * 2, binValue & 0xff, "bin"]);
					memWrites.push([n * 2 + 1, (binValue >> 8) & 0xff, "bin"]);
					n++;
				}
			}
		}
	}

	return memWrites;
}
