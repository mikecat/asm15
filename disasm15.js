"use strict";

window.onload = function() {
	// 上から試して、一番最初にマッチしたものを採用する
	// マッチするものがなければ、DATAWを出力する
	// [上位パターン, 変換先]
	// 変換先は文字列または関数
	// 関数の仕様:
	//   引数 : (mCode1, mCode2)
	//     mCode1 : 現在の位置の機械語ワード
	//     mCode2 : 次の位置の機械語ワード (無い場合は0)
	//   戻り値 : オブジェクト
	//     inst      : 変換結果のアセンブリ言語コード
	//     deltaInst : 機械語ワードを何個消費したか

	// 整数用フォーマット指定子
	// %<start-bit>,<bit-length>[,<offset>]<format>
	//   start-bit  : 数を抽出する範囲の最下位ビット (LSBが0)
	//   bit-length : 抽出する数のビット数
	//   offset     : 抽出後出力する際に足す値
	//   format     : 数の出力方法
	//                u : 10進符号なし
	var convertList = [
		["00100", "R%8,3u = %0,8u"],
		["010001100", "R%0,3u = R%3,4u"], 
		["010001101", "R%0,3,8u = R%3,4u"],

		["00110", "R%8,3u += %0,8u"],
		["00111", "R%8,3u -= %0,8u"],
		["10100", "R%8,3u = PC + %0,8,1u"],
		["010001000", "R%0,3u += %3,4u"],
		["010001001", "R%0,3,8u += %3,4u"],
		["0001110", "R%0,3u = R%3,3u + %6,3u"],
		["0001111", "R%0,3u = R%3,3u - %6,3u"],
		["0001100", "R%0,3u = R%3,3u + R%6,3u"],
		["0001101", "R%0,3u = R%3,3u - R%6,3u"],
		["0100001001", "R%0,3u = -R%3,3u"],
		["0100001101", "R%0,3u *= R%3,3u"],
		["00000", "R%0,3u = R%3,3u << %6,5u"],
		["00001", "R%0,3u = R%3,3u >> %6,5u"],
		["0100000010", "R%0,3u <<= R%3,3u"],
		["0100000011", "R%0,3u >>= R%3,3u"],
		["0100001111", "R%0,3u = ~R%3,3u"],
		["0100000000", "R%0,3u &= R%3,3u"],
		["0100001100", "R%0,3u |= R%3,3u"],
		["0100000001", "R%0,3u ^= R%3,3u"],

		["01111", "R%0,3u = [R%3,3u + %6,5u]"],
		["10001", "R%0,3u = [R%3,3u + %6,5u]W"],
		["01101", "R%0,3u = [R%3,3u + %6,5u]L"],
		["01001", "R%8,3u = [PC + %0,8u]L"],
		["0101110", "R%0,3u = [R%3,3u + R%6,3u]"],
		["0101011", "R%0,3u = [R%3,3u + R%6,3u]C"],
		["0101101", "R%0,3u = [R%3,3u + R%6,3u]W"],
		["0101111", "R%0,3u = [R%3,3u + R%6,3u]S"],
		["0101100", "R%0,3u = [R%3,3u + R%6,3u]L"],
		["01110", "[R%3,3u + %6,5u] = R%0,3u"],
		["10000", "[R%3,3u + %6,5u]W = R%0,3u"],
		["01100", "[R%3,3u + %6,5u]L = R%0,3u"],
		["0101010", "[R%3,3u + R%6,3u] = R%0,3u"],
		["0101001", "[R%3,3u + R%6,3u]W = R%0,3u"],
		["0101000", "[R%3,3u + R%6,3u]L = R%0,3u"],

		["00101", "R%8,3u - %0,8u"],
		["010001010", "R%0,3u - R%3,4u"],
		["010001011", "R%0,3,8u - R%3,4u"],
		["0100001010", "R%0,3u - R%3,3u"],
		["0100001011", "R%0,3u + R%3,3u"],
		["0100001000", "R%0,3u & R%3,3u"],

		// TODO: 分岐系
		["0100011101110000", "RET"], // 暫定 (TODO: GOTO Rmにマージ)

		["1011010", function(mCode1, mCode2) { // PUSH
			var regs = mCode1 & 0x1ff;
			if (regs === 0) {
				return {"inst": null, "deltaInst": 0};
			}
			var regsStr = "";
			for (var i = 0; i <= 7; i++) {
				if ((regs >> i) & 1) regsStr += ",R" + i;
			}
			if (regs & 0x100) regsStr += ",LR";
			return {"inst": "PUSH {" + regsStr.substr(1) + "}", "deltaInst": 1};
		}],
		["1011110", function(mCode1, mCode2) { // POP
			var regs = mCode1 & 0x1ff;
			if (regs === 0) {
				return {"inst": null, "deltaInst": 0};
			}
			var regsStr = "";
			for (var i = 0; i <= 7; i++) {
				if ((regs >> i) & 1) regsStr += ",R" + i;
			}
			if (regs & 0x100) regsStr += ",PC";
			return {"inst": "POP {" + regsStr.substr(1) + "}", "deltaInst": 1};
		}],
		["101100000", "SP += %0,7u"],
		["101100001", "SP -= %0,7u"],
		["10101", "R%8,3u = SP + %0,8u"],
		["10011", "R%8,3u = [SP + %0,8u]L"],
		["10010", "[SP + %0,8u]L = R%8,3u"],

		["1011101000", "R%0,3u = REV(R%3,3u)"],
		["1011101001", "R%0,3u = REV16(R%3,3u)"],
		["1011101011", "R%0,3u = REVSH(R%3,3u)"],
		["1011001001", "R%0,3u = SXTB(R%3,3u)"],
		["1011001000", "R%0,3u = SXTH(R%3,3u)"],
		["1011001011", "R%0,3u = UXTB(R%3,3u)"],
		["1011001010", "R%0,3u = UXTH(R%3,3u)"],
		["00010", "R%0,3u = ASR(R%3,3u, %6,5u)"],
		["0100000100", "ASR R%0,3u, R%3,3u"],
		["0100001110", "BIC R%0,3u, R%3,3u"],
		["0100000111", "ROR R%0,3u, R%3,3u"],
		["0100000101", "ADC R%0,3u, R%3,3u"],
		["0100000110", "SBC R%0,3u, R%3,3u"],

		["11001", function(mCode1, mCode2) { // LDM
			var regs = mCode1 & 0xff;
			if (regs === 0) {
				return {"inst": null, "deltaInst": 0};
			}
			var regsStr = "";
			for (var i = 0; i <= 7; i++) {
				if ((regs >> i) & 1) regsStr += ",R" + i;
			}
			return {"inst": "LDM R" + ((mCode1 >> 8) & 7) + ", {" + regsStr.substr(1) + "}", "deltaInst": 1};
		}],
		["11000", function(mCode1, mCode2) { // STM
			var regs = mCode1 & 0xff;
			if (regs === 0) {
				return {"inst": null, "deltaInst": 0};
			}
			var regsStr = "";
			for (var i = 0; i <= 7; i++) {
				if ((regs >> i) & 1) regsStr += ",R" + i;
			}
			return {"inst": "STM R" + ((mCode1 >> 8) & 7) + ", {" + regsStr.substr(1) + "}", "deltaInst": 1};
		}],

		["1011011001110010", "CPSID"],
		["1011011001100010", "CPSIE"],
		["1011111100110000", "WFI"],
		["10111110", "BKPT %0,8u"],
		["11011111", "SVC %0,8u"]
	];

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
		for (var i = 0; i < machineCodes.length;) {
			var asmInst = null;
			var deltaInst = 0;
			var machineInst = valueToString(machineCodes[i], 2, 16);
			// 該当する命令を探す
			for (var j = 0; j < convertList.length; j++) {
				var puttern = convertList[j][0];
				if (machineInst.substr(0, puttern.length) === puttern) {
					var conversion = convertList[j][1];
					if (typeof(conversion) === "function") {
						var mCode2 = (i + 1 < machineCodes.length ? machineCodes[i + 1] : 0);
						var res = conversion(machineCodes[i], mCode2);
						if (res.inst !== null) {
							asmInst = res.inst;
							deltaInst = res.deltaInst;
						}
					} else {
						asmInst = "";
						var pLeft = "" + conversion;
						for (;;) {
							var next = pLeft.indexOf("%");
							if (next < 0) {
								asmInst += pLeft;
								break;
							} else {
								asmInst += pLeft.substr(0, next);
								pLeft = pLeft.substr(next + 1);
								// 将来フォーマットが複数になったら、正規表現が使えるsearchを使う
								var formatEnd = pLeft.indexOf("u");
								if (formatEnd < 0) {
									asmInst += "%" + pLeft;
									break;
								} else {
									var formatStr = pLeft.substr(0, formatEnd + 1);
									var formatData = pLeft.substr(0, formatEnd).split(/,/);
									var formatKind = pLeft.charAt(formatEnd);
									pLeft = pLeft.substr(formatEnd + 1);
									var startBit = formatData.length > 0 ? parseInt(formatData[0]) : 0;
									var bitLength = formatData.length > 1 ? parseInt(formatData[1]) : 0;
									var offset = formatData.length > 2 ? parseInt(formatData[2]) : 0;
									if (formatKind === "u") {
										var value = ((machineCodes[i] >> startBit) & ((1 << bitLength) - 1)) + offset;
										asmInst += valueToString(value, 10);
									} else {
										asmInst += formatStr;
									}
								}
							}
						}
						deltaInst = 1;
						break;
					}
				}
			}
			// 該当する命令が無かった
			if (asmInst === null) {
				asmInst = "DATAW #" + valueToString(machineCodes[i], 16, 4);
				deltaInst = 1;
			}
			result += "\t" + asmInst + "\n";
			i += deltaInst;
		}

		// 結果を書き出す
		document.getElementById("disasm").value = result;
	};
};
