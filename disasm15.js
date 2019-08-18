"use strict";

window.onload = function() {
	var conds = ["0", "!0", "CS", "CC", "MI", "PL", "VS", "VC", "HI", "LS", "GE", "LT", "GT", "LE"];

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

	// ラベル指定子
	// $<offset>,<multiplier>[,<fallback-mode>]$
	//    offset        : この命令から参照先の場所へのオフセット
	//    multiplier    : オフセットに掛ける数(1(ワード単位)/2(2ワード単位))
	//    fallback-mode : ラベルに変換できない時の出力方法
	//                    goto  : GOTO, IF用 (デフォルト)
	//                    gosub : GOSUB用
	//                    mov   : Rd = RC + u8用
	//                    mem   : Rd = [PC + u8]L用

	// 整数用フォーマット指定子
	// %<start-bit>,<bit-length>[,<offset>]<format>
	//   start-bit  : 数を抽出する範囲の最下位ビット (LSBが0)
	//   bit-length : 抽出する数のビット数
	//   offset     : 抽出後出力する際に足す値
	//   format     : 数の出力方法
	//                u : 10進符号なし
	//                d : 10進符号あり
	var convertList = [
		["00100", "R%8,3u = %0,8u"],
		["010001100", "R%0,3u = R%3,4u"], 
		["010001101", "R%0,3,8u = R%3,4u"],

		["00110", "R%8,3u += %0,8u"],
		["00111", "R%8,3u -= %0,8u"],
		["10100", "R%8,3u = $%0,8,1u,2,mov$"],
		["010001000", "R%0,3u += R%3,4u"],
		["010001001", "R%0,3,8u += R%3,4u"],
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
		["01001", "R%8,3u = [$%0,8,1u,2,mem$]L"],
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

		["1101", function(mCode1, mCode2) { // IF cond GOTO n8
			var cond = (mCode1 >> 8) & 0xf;
			if (cond >= conds.length) {
				return {"inst": null, "deltaInst": 0};
			}
			var offset = (mCode1 + 2) & 0xff;
			if (offset & 0x80) offset -= 0x100;
			return {"inst": "IF " + conds[cond] + " GOTO $" + offset + ",1$", "deltaInst": 1};
		}],
		["11100", "GOTO $%0,11,2d,1$"],
		["010001110", function(mCode1, mCode2) { // GOTO Rm / RET
			if ((mCode1 & 7) !== 0) {
				return {"inst": null, "deltaInst": 0};
			}
			var reg = (mCode1 >> 3) & 0xf;
			return {"inst": (reg === 14 ? "RET" : "GOTO R" + reg), "deltaInst": 1};
		}],
		["010001111", function(mCode1, mCode2) { // GOSUB Rm
			if ((mCode1 & 7) !== 0) {
				return {"inst": null, "deltaInst": 0};
			}
			var reg = (mCode1 >> 3) & 0xf;
			return {"inst": "GOSUB R" + reg, "deltaInst": 1};
		}],
		["11110", function(mCode1, mCode2) { // GOSUB n22
			if (((mCode2 >> 11) & 0x1f) !== 0x1f) {
				return {"inst": null, "deltaInst": 0};
			}
			var offset = (((mCode2 & 0x7ff) | ((mCode1 & 0x7ff) << 11)) + 2) & 0x3fffff;
			if (offset & 0x200000) offset -= 0x400000;
			return {"inst": "GOSUB $" + offset + ",1,gosub$", "deltaInst": 2};
		}],

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

		["1011001001", "R%0,3u = SXTB(R%3,3u)"],
		["1011001000", "R%0,3u = SXTH(R%3,3u)"],
		["1011001011", "R%0,3u = UXTB(R%3,3u)"],
		["1011001010", "R%0,3u = UXTH(R%3,3u)"],

		["1011011001110010", "CPSID"],
		["1011011001100010", "CPSIE"],
		["1011111100110000", "WFI"],
		["1011111100010000", "YIELD"],
		["1011111100100000", "WFE"],
		["1011111101000000", "SEV"],
		["11011111", "SVC %0,8u"],
		["10111110", "BKPT %0,8u"]
	];

	function valueToString(value, radix = 10, digit = 0) {
		var result = value.toString(radix).toUpperCase();
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
			addr -= addr & 3; // 4バイトアライメントにする
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
		var result = [];
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
								var formatEnd = pLeft.search(/[ud]/);
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
									console.log(formatData);
									console.log(offset);
									if (formatKind === "u" || formatKind === "d") {
										var value = ((machineCodes[i] >> startBit) & ((1 << bitLength) - 1));
										if (formatKind === "d" && (value >> (bitLength - 1)) !== 0) {
											value = value - (1 << bitLength);
										}
										value += offset;
										if (value >= 0) {
											asmInst += valueToString(value, 10);
										} else {
											asmInst += "-" + valueToString(-value, 10);
										}
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
			result.push([i, asmInst]);
			i += deltaInst;
		}

		// ラベルの処理を行う
		var definedLabels = {};
		var usedLabels = {};
		// 定義可能なラベルを登録する
		for (var i = 0; i < result.length; i++) {
			definedLabels[result[i][0]] = true;
		}
		// 置き換えられるオフセットをラベルに書き換え、使われているラベルを記録する
		for (var i = 0; i < result.length; i++) {
			var leftSegment = result[i][1];
			var processResult = "";
			for (;;) {
				var idx = leftSegment.indexOf("$");
				if (idx < 0) {
					processResult += leftSegment;
					break;
				} else {
					processResult += leftSegment.substr(0, idx);
					leftSegment = leftSegment.substr(idx + 1);
					var idx2 = leftSegment.indexOf("$");
					if (idx2 < 0) {
						processResult += "$" + leftSegment;
						break;
					} else {
						var data = leftSegment.substr(0, idx2).split(",");
						leftSegment = leftSegment.substr(idx2 + 1);
						var offset = data.length > 0 ? parseInt(data[0]) : 0;
						var multiplier = data.length > 1 ? parseInt(data[1]) : 1;
						var mode = data.length > 2 ? data[2] : "goto";
						var targetAddress =
							(result[i][0] & ~((1 << (multiplier - 1)) - 1)) +
							multiplier * offset;
						if (targetAddress in definedLabels) {
							usedLabels[targetAddress] = true;
							processResult += "@L" + valueToString(targetAddress * 2 + 0x700, 16);
						} else {
							if (mode === "gosub") {
								processResult += valueToString(offset * 2, 10);
							} else if (mode === "mov") {
								processResult += "PC + " +  valueToString(offset, 10);
							} else if (mode === "mem") {
								processResult += valueToString(offset, 10);
							} else { // "goto"
								processResult += valueToString(offset, 10);
							}
						}
					}
				}
			}
			result[i][1] = processResult;
		}
		// 使われているラベルを出力しつつ、コードを書き出す
		var resultStr = "";
		for (var i = 0; i < result.length; i++) {
			if (result[i][0] in usedLabels) {
				resultStr += "@L" + valueToString(result[i][0] * 2 + 0x700, 16) + "\n";
			}
			resultStr += "\t" + result[i][1] + "\n";
		}

		// 結果を書き出す
		document.getElementById("disasm").value = resultStr;
	};
};
