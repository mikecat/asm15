function parseBasInt(s) {
	if (s.substr(0, 1) === "#") return parseInt(s.substr(1), 16);
	else if (s.substr(0, 1) === "`") return parseInt(s.substr(1), 2);
	else return parseInt(s, 10);
}

function readMachineCode(codeStr) {
	var s = codeStr.split("\n");
	var n = 0;

	var memWrites = [];
	for (var i = 0; i < s.length; i++) {
		var basCode = s[i].replace(/\s/g, ""); // erase spaces
		basCode = basCode.replace(/^\d+/, ""); // erase line number
		basCode = basCode.replace(/'.*$/, ""); // erase comment
		var basCodes = basCode.split(":");
		var basValid = false;
		for (var j = 0; j < basCodes.length; j++) {
			var code = basCodes[j];
			var matched;
			if ((matched = /^poke(#[0-9a-fA-F]+|[0-9]+|`[01]+),/i.exec(code))) {
				var addr = parseBasInt(matched[1]);
				var data = code.split(",");
				for (var k = 1; k < data.length; k++) {
					memWrites.push([addr, parseBasInt(data[k]), "poke"]);
					addr++;
				}
				basValid = true;
			} else if ((matched = /^\[(#[0-9a-fA-F]+|[0-9]+|`[01]+)\]=(#[0-9a-fA-F]+|[0-9]+|`[01]+)$/i.exec(code))) {
				var idx = parseBasInt(matched[1]);
				var value = parseBasInt(matched[2]);
				memWrites.push([0x800 + idx * 2, value & 0xff, "array"]);
				memWrites.push([0x800 + idx * 2 + 1, (value >> 8) & 0xff, "array"]);
				basValid = true;
			} else if ((matched = /^let\[(#[0-9a-fA-F]+|[0-9]+|`[01]+)\],/i.exec(code))) {
				var idx = parseBasInt(matched[1]);
				var data = code.split(",");
				for (var k = 1; k < data.length; k++) {
					var value = parseBasInt(data[k]);
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
				var binCode = s[i].replace(/[^01]/g, "");
				if (binCode.length == 16) {
					var binValue = parseInt(binCode, 2);
					memWrites.push([n * 2, binValue & 0xff, "bin"]);
					memWrites.push([n * 2 + 1, (binValue >> 8) & 0xff, "bin"]);
					n++;
				}
			}
		}
	}

	return memWrites;
}
