"use strict";

window.onload = function() {
	function valueToString(value, radix = 10, digit = 0) {
		var result = value.toString(radix);
		while (result.length < digit) result = "0" + result;
		return result;
	}

	document.getElementById("disasmbutton").onclick = function() {
		// マシン語列を取得する
		var memWrites = readMachineCode(document.getElementById("mcode").value);
		// アドレスの昇順にソートする
		// 安定させる用に順番を追加する
		for (var i = 0; i < memWrites.length; i++) memWrites[i].unshift(i);
		memWrites.sort(function(a, b) {
			if (a[1] !== b[1]) {
				return a[1] > b[1] ? 1 : (a[1] < b[1] ? -1 : 0);
			} else {
				return a[0] > b[0] ? 1 : (a[0] < b[0] ? -1 : 0);
			}
		});
		// 安定させる用の順番を取る
		for (var i = 0; i < memWrites.length; i++) memWrites[i].shift();
		// アドレスが重複しているとき、最後以外を削除する
		for (var i = 1; i < memWrites.length; i++) {
			if (memWrites[i - 1][0] === memWrites[i][0]) {
				memWrites.splice(--i, 1);
			}
		}
		// バイト列からワード列に変換する
		var machineCodes = [];
		if (memWrites.length > 0) {
			var addr = memWrites[0][0];
			if (addr & 1) addr--;
			for (var i = 0; i < memWrites.length;) {
				if (memWrites[i][0] === addr) {
					if (i + 1 < memWrites.length && memWrites[i + 1][0] === addr + 1) {
						machineCodes.push(memWrites[i][1] | (memWrites[i + 1][1] << 8));
						i += 2;
					} else {
						machineCodes.push(memWrites[i][1]);
						i++;
					}
					addr += 2;
				} else if (memWrites[i][0] === addr + 1) {
					machineCodes.push(memWrites[i][1] << 8);
					i++;
					addr += 2;
				} else {
					machineCodes.push(0);
					addr += 2;
				}
			}
		}

		// ワード列をasm15に変換する
		var result = "";
		for (var i = 0; i < machineCodes.length; i++) {
			result += "\tDATAW #" + valueToString(machineCodes[i], 16, 4) + "\n";
		}

		// 結果を書き出す
		document.getElementById("disasm").value = result;
	};
};
