"use strict";

if (typeof NOTOPCODE === "undefined" && typeof require !== "undefined") {
	require("./asm15constants.js");
}

const my_fmt_dict = typeof fmt_dict !== "undefined" ? fmt_dict : require("./asm15output.js").fmt_dict;

let lbl_dict = {};
// let lbl_align4 = [];

const token_dict = {
"rlist":"\\{(.+)\\}",
"label":"(@.+)",
"h":"r(8|9|10|11|12|13|14|15)",
"reg":"r([0-7])",
"reg16":"r([0-9]|1[0-5])",
"reg32":"r([0-9]|[12][0-9]|3[01])",
"push":"push",
"pop":"pop",
"ldm":"ldm",
"stm":"stm",
"!":"\\!",
"=":"=",
"<<":"<<",
">>":">>",
">>>":">>>",
"+":"\\+",
"ofs":"([\\+\\-]{1}.+)",
"|":"\\|",
//"n":"((?:\\-|0b|0x)?[0-0a-f]{1,8})",
"n":"(.+)",
"-":"\\-",
"&":"&",
"^":"\\^",
"not":"(?:\\~|not)",

"cond":"(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|hs|lo)",
"al":"al",
"m0":"m0",

"*":"\\*",
"/":"/",
"%":"%",
"if":"if",
"goto":"goto",
"call":"call",
"gosub":"gosub", // for 後方互換
"ret":"ret",
"":"",
"[":"\\[",
"]":"\\]",
"b":"b",
"w":"w",
"l":"l",
"s":"s",
"c":"c",
"0":"0",
"data":"data",
"pc":"pc",
"sp":"sp",
"cpsid":"cpsid",
"cpsie":"cpsie",
"nop":"nop",
"nopf":"nopf",
"wfi":"wfi",
"yield":"yield",
"wfe":"wfe",
"sev":"sev",
"bkpt":"bkpt",
"svc":"svc",
"dmb":"dmb",
"dsb":"dsb",
"isb":"isb",
"sreg":"(apsr|ipsr|epsr|iepsr|iapsr|eapsr|psr|xpsr|msp|psp|primask|control)",
",":",",

"bic":"bic",
"asr":"asr",
"ror":"ror",
"revsh":"revsh",
"rev16":"rev16",
"rev":"rev",
"sxtb":"sxtb",
"sxth":"sxth",
"uxtb":"uxtb",
"uxth":"uxth",
"adc":"adc",
"sbc":"sbc",
"mulh":"mulh",
"mulhsu":"mulhsu",
"mulhu":"mulhu",
"divu":"divu",
"remu":"remu",
"<":"<",
">":">",
"ltu":"ltu",
"jal":"jal",
"jalr":"jalr",
"geu":"geu",
"csrrw":"csrrw",
"csrrs":"csrrs",
"csrrc":"csrrc",
"csrrwi":"csrrwi",
"csrrsi":"csrrsi",
"csrrci":"csrrci",
"fence":"fence",
"fence.tso":"fence\\.tso",
"ecall":"ecall",
"ebreak":"ebreak",
"mret":"mret",
"(":"\\(",
")":"\\)",
"iaddrw":"iaddrw",
"iaddrl":"iaddrl",
"daddrw":"daddrw",
"daddrl":"daddrl",
};

function patfactory(s) {
	s = s.split(" ");
	const p = [ "^" ];
	for (let i = 0; i < s.length; i++) {
		p.push(token_dict[s[i].toLowerCase()]);
	}
	p.push("$");
	s = p.join("");
	return RegExp(s);
}

function rlist(){
	const pat=/r([0-7])-r([0-7])/;
	const f=function(d,pc){
		let ret=0,r,i,j,a,rs=d.split(",");
		for(i=0;i<rs.length;i++){
			r=rs[i];
			a=r.match(pat)
			if(a){
				for(j=parseInt(a[1]);j<=parseInt(a[2]);j++){
					ret|=(1<<j);
				}
			}else if (r.charAt(0)=="r"){
				r=parseInt(r.slice(1));
				if(r>=0&&r<8){
					ret|=(1<<r);
				}else if (r==14||r==15){
					ret|=0x100;
				}else{
					throw new Error("unsupported register");
				}
			} else if (r=="pc" || r=="lr"){
				ret|=0x100;
			}
		}
		return ret;
	}
	return f;
}
function n(bits, s, ofs, div, align4) {
	//dat bit shift
	ofs=(ofs!=undefined)?ofs:0;
	div=(div!=undefined)?div:0;
	let mask=Math.pow(2,bits)-1;
	const mx=Math.pow(2,bits-1)-1;
	const mn=-Math.pow(2,bits-1);
	if (mask < 1)
		mask = 0;
	const f = function(d, pc){
		const ret = d.match(/@\w+/g);
		if (ret != null) {
			for (let i = 0; i < ret.length; i++) {
				const lbl = ret[i];
				if (lbl in lbl_dict) {
					const adl = lbl_dict[lbl];
					let ad = adl - (pc & 0x0fffffffe);
					if (align4 && ad < 0) {
						throw new Error("can't use minus address");
					}
					if (align4) { // 追加 r0=[sp+n] のとき (バグ修正)
						//lbl_align4.push(lbl);
						if (adl % 4 == 2) {
							ad += 2;
						}
						if (pc % 4 == 2) {
							ad += 2;
						}
					}
					const rel = ad >> div; // 0x0fffffffc -> 0x0fffffffe
//					alert(lbl_dict[lbl].toString(16) + " " + pc.toString(16) + " " + div + " " + ((pc & 0x0fffffffe)) + " " + lbl + " " + rel);
					if (rel > mx || rel < mn) {
						throw new Error("too far");
					}
					d = d.replace(lbl, rel, "g");
				} else {
					return YET;
				}
			}
		}
		d = pint(d) + ofs;
		return (d & mask) << s;
	}
	return f;
}
function na(bits, s, or1) {
	const fn = n(bits, s, 0, false, false);
	const f = function(d, pc) {
		let ret = fn(d, 0);
		if (ret == YET) return ret;
		if (or1) ret |= 1 << s;
		return ret;
	}
	return f;
}
function b(bits, s, ofs, chk) {
	//dat bit shift,ofs
	ofs = (ofs != undefined) ? ofs : 0;
	let mask = Math.pow(2, bits) - 1;
	if (mask < 1)
		mask = 0;
//console.log(bits,s,ofs);
	const f = function(d, pc) {
		//console.log(bits,s,ofs);
		d = pint(d);
		if (chk) {
			if (d & ~mask) {
				throw new Error("over!");
			}
		}
		return (d & mask) << s;
	}
	return f;
}
function bu(bits, s, ofs) {
	return b(bits, s, ofs, true);
}
function cond(ofs, invert) {
	const f = function(d, pc) {
		if (d == "hs") {
			d = "cs";
		} else if (d == "lo") {
			d = "cc";
		}
		let n = "eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le".indexOf(d) / 3;
		if (invert)
			n ^= 1;
		return n << ofs;
	};
	return f;
}
function n6n18() {
	const f = function(d, pc) {
		d = pint(d);
		if ((d & 0xffffffe0) == 0 || ((d >> 5) & 0x07ffffff) == 0x07ffffff) {
			return ((d & 0x1f) << 2) | (((d >> 5) & 0x1) << 12);
		} else if (((d & 0xfffe0000) == 0 || ((d >> 17) & 0x00007fff) == 0x00007fff) && (d & 0xfff) == 0) {
			return (((d >> 12) & 0x1f) << 2) | (((d >> 17) & 0x1) << 12) | (0x1 << 13);
		} else {
			throw new Error("invalid value");
		}
	};
	return f;
}
function d(func, plist) {
	// plist: array of [src_shift,dst_shift,bits]
	const f = function(d, pc) {
		const value = func(d, pc);
		if (value >= NOTOPCODE) {
			return value;
		}
		let ret = 0;
		for (let i = 0; i < plist.length; i++) {
			if (plist[i][1] >= 0) {
				ret |= ((value >> plist[i][0]) & ((1 << plist[i][2]) - 1)) << plist[i][1];
			} else {
				if (((value >> plist[i][0]) & ((1 << plist[i][2]) - 1)) != 0) {
					throw new Error("invalid value");
				}
			}
		}
		return ret;
	};
	return f;
}
function reg32_label() {
	// reg32 = label
	// auipc + addi
	const nfunc = n(32, 0, 0, 0);
	const bufunc = bu(5, 0);
	const f = function(ar, pc) {
		let target = nfunc(ar[2], pc);
		if (target >= NOTOPCODE) {
			return [target, target, target, target];
		}
		if (target & 0x800) target += 0x1000;
		const reg = bufunc(ar[1], pc);
		const auipc = (target & 0xfffff000) | (reg << 7) | 0x17;
		const addi = ((target & 0xfff) << 20) | (reg << 15) | (reg << 7) | 0x13;
		return [auipc & 0xffff, (auipc >> 16) & 0xffff, addi & 0xffff, (addi >> 16) & 0xffff];
	};
	return f;
}
function sreg(s) {
	const f = function(d, pc) {
		let value = 0;
		if (d == "apsr") value = 0;
		else if (d == "iapsr") value = 1;
		else if (d == "eapsr") value = 2;
		else if (d == "xpsr" || d == "psr") value = 3;
		else if (d == "ipsr") value = 5;
		else if (d == "epsr") value = 6;
		else if (d == "iepsr") value = 7;
		else if (d == "msp") value = 8;
		else if (d == "psp") value = 9;
		else if (d == "primask") value = 16;
		else if (d == "control") value = 20;
		return value << s;
	};
	return f;
}
function build_m(f, ar, pc) {
	let op = f[1];
	if ((typeof op) == "number") {
		// number : 16-bit instruction
		for (let i = 1; i < ar.length; i++) {
			//console.log(i + " " + ar[i]);
			const _op = f[i + 1](ar[i], pc);
			if (_op >= NOTOPCODE) {
				return _op;
			} else {
				op = op | _op;
			}
		}
		return 0xffff & op;
	} else if ((typeof op) == "function") {
		// function : custom (longer) instruction
		return op(ar, pc);
	} else {
		// array : 32-bit instruction
		op = op[0];
		for (let i = 1; i < ar.length; i++) {
			//console.log(i + " " + ar[i]);
			const _op = f[i + 1](ar[i], pc);
			if (_op >= NOTOPCODE) {
				return [_op, _op];
			} else {
				op = op | _op;
			}
		}
		return [0xffff & op, 0xffff & (op >> 16)];
	}
}

const cmdlist_m0 = [
//special
["reg = rev ( reg )",0xba00,b(3,0),b(3,3)],
["reg = rev16 ( reg )",0xba40,b(3,0),b(3,3)],
["reg = revsh ( reg )",0xbac0,b(3,0),b(3,3)],
["reg = asr ( reg , n )",0x1000,b(3,0),b(3,3),b(5,6,0)],
["asr reg , reg",0x4100,b(3,0),b(3,3)],
["ror reg , reg",0x41c0,b(3,0),b(3,3)],
["bic reg , reg",0x4380,b(3,0),b(3,3)],
["adc reg , reg",0x4140,b(3,0),b(3,3)],
["reg + = reg + c",0x4140,b(3,0),b(3,3)],
["sbc reg , reg",0x4180,b(3,0),b(3,3)],
["reg - = reg + ! c",0x4180,b(3,0),b(3,3)],

//extension
["reg = sxtb ( reg )",0xb240,b(3,0),b(3,3)],
["reg = sxth ( reg )",0xb200,b(3,0),b(3,3)],
["reg = uxtb ( reg )",0xb2c0,b(3,0),b(3,3)],
["reg = uxth ( reg )",0xb280,b(3,0),b(3,3)],

//jmp
["if 0 goto n",0xd000,n(8,0,-2,1)],
["if ! 0 goto n",0xd100,n(8,0,-2,1)],
["if cond goto n",0xd000,cond(8,0),n(8,0,-2,1)],
["if ! cond goto n",0xd000,cond(8,1),n(8,0,-2,1)],
["if al goto n",0xe000,n(11,0,-2,1)], // always jump == unconditional jump
["if ! al goto n",0x46c0, function(){return 0;}], // never jump == NOP
["goto reg",0x4700,b(3,3)],
["goto h",0x4740,b(3,3)],
["call reg",0x4780,b(3,3)], // 追加
["call h",0x47C0,b(3,3)], // 追加
["gosub reg",0x4780,b(3,3)],
["gosub h",0x47C0,b(3,3)], // 追加 GOSUB == CALL
["goto n",0xe000,n(11,0,-2,1)], // div 2->1
["gosub n",[0xf800f000],d(n(22,0,-2,1),[[0,16,11],[11,0,11]])],

//sp
["sp + = n",0xb000,bu(7,0,0)],
["sp - = n",0xb080,bu(7,0,0)],
["reg = sp + n",0xa800,b(3,8),bu(8,0,0)],
["reg = [ sp + n ] l",0x9800,b(3,8),bu(8,0)],
["[ sp + n ] l = reg",0x9000,b(8,0),bu(3,8)],

//memory
["reg = [ reg + reg ]",  0x5c00,b(3,0),b(3,3),b(3,6)],
["reg = [ reg + reg ] b",0x5c00,b(3,0),b(3,3),b(3,6)],
["reg = [ reg + reg ] c",0x5600,b(3,0),b(3,3),b(3,6)],
["reg = [ reg + reg ] w",0x5a00,b(3,0),b(3,3),b(3,6)],
["reg = [ reg + reg ] s",0x5e00,b(3,0),b(3,3),b(3,6)],
["reg = [ reg + reg ] l",0x5800,b(3,0),b(3,3),b(3,6)],
["[ reg + reg ] = reg",  0x5400,b(3,3),b(3,6),b(3,0)],
["[ reg + reg ] b = reg",0x5400,b(3,3),b(3,6),b(3,0)],
["[ reg + reg ] w = reg",0x5200,b(3,3),b(3,6),b(3,0)],
["[ reg + reg ] l = reg",0x5000,b(3,3),b(3,6),b(3,0)],

["reg = [ reg + n ]",  0x7800,b(3,0),b(3,3),bu(5,6,0)],
["reg = [ reg + n ] b",0x7800,b(3,0),b(3,3),bu(5,6,0)],
["reg = [ reg + n ] w",0x8800,b(3,0),b(3,3),bu(5,6,0)],
["reg = [ reg + n ] l",0x6800,b(3,0),b(3,3),bu(5,6,0)],
["reg = [ reg ]",  0x7800,b(3,0),b(3,3)],
["reg = [ reg ] b",0x7800,b(3,0),b(3,3)],
["reg = [ reg ] w",0x8800,b(3,0),b(3,3)],
["reg = [ reg ] l",0x6800,b(3,0),b(3,3)],

["[ reg + n ] = reg",   0x7000,b(3,3),bu(5,6,0),b(3,0)],
["[ reg + n ] b = reg", 0x7000,b(3,3),bu(5,6,0),b(3,0)],
["[ reg + n ] w = reg", 0x8000,b(3,3),bu(5,6,0),b(3,0)],
["[ reg + n ] l = reg", 0x6000,b(3,3),bu(5,6,0),b(3,0)],
["[ reg ] = reg",   0x7000,b(3,3),b(3,0)],
["[ reg ] b = reg", 0x7000,b(3,3),b(3,0)],
["[ reg ] w = reg", 0x8000,b(3,3),b(3,0)],
["[ reg ] l = reg", 0x6000,b(3,3),b(3,0)],

["reg = reg << n",0x0,b(3,0),b(3,3),bu(5,6)],
["reg = reg >> n",0x0800,b(3,0),b(3,3),bu(5,6)],
["reg = reg + reg",0x1800,b(3,0),b(3,3),b(3,6)],
["reg = reg - reg",0x1a00,b(3,0),b(3,3),b(3,6)],
["reg = reg + n",0x1c00,b(3,0),b(3,3),bu(3,6)],
["reg = reg - n",0x1e00,b(3,0),b(3,3),bu(3,6)],
["reg & = reg",0x4000,b(3,0),b(3,3)],
["reg ^ = reg",0x4040,b(3,0),b(3,3)],
["reg << = reg",0x4080,b(3,0),b(3,3)],
["reg >> = reg",0x40c0,b(3,0),b(3,3)],
["reg = - reg",0x4240,b(3,0),b(3,3)],
["reg + = reg",0x4400,b(3,0),b(3,3)],
["reg + = h",0x4440,b(3,0),b(3,3)],
["h + = reg",0x4480,b(3,0),b(3,3)],
["h + = h",0x44C0,b(3,0),b(3,3)],
["reg | = reg",0x4300,b(3,0),b(3,3)],
["reg * = reg",0x4340,b(3,0),b(3,3)],
["reg & = not reg",0x4380,b(3,0),b(3,3)],
["reg = not reg",0x43c0,b(3,0),b(3,3)],
["reg + = n",0x3000,b(3,8),bu(8,0)],
["reg - = n",0x3800,b(3,8),bu(8,0)],
//cmp
["reg - reg",0x4280,b(3,0),b(3,3)],
["reg - h",0x4540,b(3,0),b(3,3)],
["h - reg",0x4580,b(3,0),b(3,3)],
["h - h",0x45C0,b(3,0),b(3,3)],
["reg + reg",0x42C0,b(3,0),b(3,3)],
["reg & reg",0x4200,b(3,0),b(3,3)],
["reg - n",0x2800,b(3,8),bu(8,0)],
//ret
["ret",0x4770],
//let
["h = h",0x46c0,b(3,0),b(3,3)],
["h = reg",0x4680,b(3,0),b(3,3)],
["reg = h",0x4640,b(3,0),b(3,3)],
["reg = reg",0x4600,b(3,0),b(3,3)],

["reg = pc + n",0xa000,b(3,8),n(8,0,-1,2)],
["reg = label",0xa000,b(3,8),n(8,0,-1,2,1)], // align4
["reg = [ n ] l",0x4800,b(3,8,0),n(8,0,-1,2,1)], // align4

["reg = n",0x2000,b(3,8),bu(8,0,0)],
["push rlist",0xb400,rlist()],
["pop rlist",0xbc00,rlist()],

["ldm reg , rlist",0xc800,b(3,8),rlist()], // add
["stm reg , rlist",0xc000,b(3,8),rlist()], // add

//other
["cpsid",0xB672],
["cpsie",0xB662],
["wfi",0xbf30],
["yield",0xbf10],
["wfe",0xbf20],
["sev",0xbf40],
["bkpt n",0xbe00,bu(8,0)],
["svc n",0xdf00,bu(8,0)],
["dmb",[0x8f5ff3bf]],
["dsb",[0x8f4ff3bf]],
["isb",[0x8f6ff3bf]],
["reg16 = sreg",[0x8000f3ef],b(4,24),sreg(16)],
["sreg = reg16",[0x8800f380],sreg(16),b(4,0)],
["nop",0],
["nopf",0x46c0],

["if m0 goto n",[0xe0002fb7],n(11,16,-3,1)],

["iaddrw n",0,na(16,0,true)],
["iaddrl n",[0],na(32,0,true)],
["daddrw n",0,na(16,0)],
["daddrl n",[0],na(32,0)],
];

const cmdlist_rv32c = [
["reg32 + = n",0x0001,b(5,7),d(b(6,0),[[0,2,5],[5,12,1]])],
["reg32 << = n",0x0002,b(5,7),bu(5,2)],
["reg32 + = reg32",0x9002,b(5,7),b(5,2)],
["h >> = n",0x8001,b(3,7),bu(5,2)],
["h >>> = n",0x8401,b(3,7),bu(5,2)],
["h & = n",0x8801,b(3,7),d(b(6,0),[[0,2,5],[5,12,1]])],
["h - = h",0x8C01,b(3,7),b(3,2)],
["h ^ = h",0x8C21,b(3,7),b(3,2)],
["h | = h",0x8C41,b(3,7),b(3,2)],
["h & = h",0x8C61,b(3,7),b(3,2)],

["reg32 = reg32 * reg32",[0x02000033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 / reg32",[0x02004033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 % reg32",[0x02006033],b(5,7),b(5,15),b(5,20)],
["reg32 = mulh ( reg32 , reg32 )",[0x02001033],b(5,7),b(5,15),b(5,20)],
["reg32 = mulhsu ( reg32 , reg32 )",[0x02002033],b(5,7),b(5,15),b(5,20)],
["reg32 = mulhu ( reg32 , reg32 )",[0x02003033],b(5,7),b(5,15),b(5,20)],
["reg32 = divu ( reg32 , reg32 )",[0x02005033],b(5,7),b(5,15),b(5,20)],
["reg32 = remu ( reg32 , reg32 )",[0x02007033],b(5,7),b(5,15),b(5,20)],

["h = [ h + n ] l",0x4000,b(3,2),b(3,7),d(bu(7,0),[[0,-1,2],[2,6,1],[3,10,3],[6,5,1]])],
["[ h + n ] l = h",0xC000,b(3,7),d(bu(7,0),[[0,-1,2],[2,6,1],[3,10,3],[6,5,1]]),b(3,2)],

["if ! h goto n",0xC001,b(3,7),d(n(8,1,0,1),[[0,-1,1],[1,3,2],[3,10,2],[5,2,1],[6,5,2],[8,12,1]])],
["if h goto n",0xE001,b(3,7),d(n(8,1,0,1),[[0,-1,1],[1,3,2],[3,10,2],[5,2,1],[6,5,2],[8,12,1]])],
["goto n",0xA001,d(n(11,1,0,1),[[0,-1,1],[1,3,3],[4,11,1],[5,2,1],[6,7,1],[7,6,1],[8,9,2],[10,8,1],[11,12,1]])],
["goto reg32",0x8002,b(5,7)],
["gosub n",0x2001,d(n(11,1,0,1),[[0,-1,1],[1,3,3],[4,11,1],[5,2,1],[6,7,1],[7,6,1],[8,9,2],[10,8,1],[11,12,1]])],
["gosub reg32",0x9002,b(5,7)],
["ret",0x8082],

["push reg32 , n",0xC002,b(5,2),d(bu(6,2),[[0,-1,2],[2,9,4],[6,7,2]])],
["[ sp + n ] l = reg32",0xC002,d(bu(6,2),[[0,-1,2],[2,9,4],[6,7,2]]),b(5,2)],
["pop reg32 , n",0x4002,b(5,7),d(bu(6,2),[[0,-1,2],[2,4,3],[5,12,1],[6,2,2]])],
["reg32 = [ sp + n ] l",0x4002,b(5,7),d(bu(6,2),[[0,-1,2],[2,4,3],[5,12,1],[6,2,2]])],
["h = sp + n",0x0000,b(3,2),d(bu(8,2),[[0,-1,2],[2,6,1],[3,5,1],[4,11,2],[6,7,4]])],
["sp + = n",0x6101,d(b(6,4),[[0,-1,4],[4,6,1],[5,2,1],[6,5,1],[7,3,2],[9,12,1]])],

["nop",0x0001],
["bkpt",0x9002],
["wfi",[0x10500073]],

["reg32 = reg32",0x8002,b(5,7),b(5,2)],
["reg32 = n",0x4001,b(5,7),n6n18()],

["reg32 = n",[0x00000037],b(5,7),d(b(32,0),[[0,-1,12],[12,12,20]])],

["reg32 = pc + n",[0x00000017],b(5,7),b(20,12)],
["reg32 = pc",[0x00000017],b(5,7)],
["reg32 = label",reg32_label()],
["reg32 = reg32 + n",[0x00000013],b(5,7),b(5,15),b(12,20)],
["reg32 = reg32 + reg32",[0x00000033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 - reg32",[0x40000033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 << n",[0x00001013],b(5,7),b(5,15),bu(5,20)],
["reg32 = reg32 >> n",[0x00005013],b(5,7),b(5,15),bu(5,20)],
["reg32 = reg32 >>> n",[0x40005013],b(5,7),b(5,15),bu(5,20)],
["reg32 = reg32 << reg32",[0x00001033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 >> reg32",[0x00005033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 >>> reg32",[0x40005033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 ^ n",[0x00004013],b(5,7),b(5,15),b(12,20)],
["reg32 = reg32 | n",[0x00006013],b(5,7),b(5,15),b(12,20)],
["reg32 = reg32 & n",[0x00007013],b(5,7),b(5,15),b(12,20)],
["reg32 = reg32 ^ reg32",[0x00004033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 | reg32",[0x00006033],b(5,7),b(5,15),b(5,20)],
["reg32 = reg32 & reg32",[0x00007033],b(5,7),b(5,15),b(5,20)],

["reg32 = [ reg32 + n ]",  [0x00004003],b(5,7),b(5,15),b(12,20)],
["reg32 = [ reg32 + n ] b",[0x00004003],b(5,7),b(5,15),b(12,20)],
["reg32 = [ reg32 + n ] c",[0x00000003],b(5,7),b(5,15),b(12,20)],
["reg32 = [ reg32 + n ] w",[0x00005003],b(5,7),b(5,15),b(12,20)],
["reg32 = [ reg32 + n ] s",[0x00001003],b(5,7),b(5,15),b(12,20)],
["reg32 = [ reg32 + n ] l",[0x00002003],b(5,7),b(5,15),b(12,20)],
["[ reg32 + n ] = reg32",  [0x00000023],b(5,15),d(b(12,0),[[0,7,5],[5,25,7]]),b(5,20)],
["[ reg32 + n ] b = reg32",[0x00000023],b(5,15),d(b(12,0),[[0,7,5],[5,25,7]]),b(5,20)],
["[ reg32 + n ] w = reg32",[0x00001023],b(5,15),d(b(12,0),[[0,7,5],[5,25,7]]),b(5,20)],
["[ reg32 + n ] l = reg32",[0x00002023],b(5,15),d(b(12,0),[[0,7,5],[5,25,7]]),b(5,20)],

["reg32 = reg32 < n",[0x00002013],b(5,7),b(5,15),b(12,20)],
["reg32 = ltu ( reg32 , n )",[0x00003013],b(5,7),b(5,15),b(12,20)],
["reg32 = reg32 < reg32",[0x00002033],b(5,7),b(5,15),b(5,20)],
["reg32 = ltu ( reg32 , reg32 )",[0x00003033],b(5,7),b(5,15),b(5,20)],

["jal reg32 , n",[0x0000006F],b(5,7),d(n(20,1,0,1),[[0,-1,1],[1,21,10],[11,20,1],[12,12,8],[20,31,1]])],
["goto n",[0x0000006F],d(n(20,1,0,1),[[0,-1,1],[1,21,10],[11,20,1],[12,12,8],[20,31,1]])],
["gosub n",[0x000000EF],d(n(20,1,0,1),[[0,-1,1],[1,21,10],[11,20,1],[12,12,8],[20,31,1]])],
["jalr reg32 , reg32 + n",[0x00000067],b(5,7),b(5,15),b(12,20)],
["jalr reg32 , reg32",[0x00000067],b(5,7),b(5,15)],
["if reg32 = reg32 goto n",[0x00000063],b(5,15),b(5,20),d(n(12,1,0,1),[[0,-1,1],[1,8,4],[5,25,6],[11,7,1],[12,31,1]])],
["if reg32 ! = reg32 goto n",[0x00001063],b(5,15),b(5,20),d(n(12,1,0,1),[[0,-1,1],[1,8,4],[5,25,6],[11,7,1],[12,31,1]])],
["if reg32 < reg32 goto n",[0x00004063],b(5,15),b(5,20),d(n(12,1,0,1),[[0,-1,1],[1,8,4],[5,25,6],[11,7,1],[12,31,1]])],
["if reg32 > =  reg32 goto n",[0x00005063],b(5,15),b(5,20),d(n(12,1,0,1),[[0,-1,1],[1,8,4],[5,25,6],[11,7,1],[12,31,1]])],
["if ltu ( reg32 , reg32 ) goto n",[0x00006063],b(5,15),b(5,20),d(n(12,1,0,1),[[0,-1,1],[1,8,4],[5,25,6],[11,7,1],[12,31,1]])],
["if geu ( reg32 , reg32 ) goto n",[0x00007063],b(5,15),b(5,20),d(n(12,1,0,1),[[0,-1,1],[1,8,4],[5,25,6],[11,7,1],[12,31,1]])],

["csrrw reg32 , n , reg32",[0x00001073],b(5,7),bu(12,20),b(5,15)],
["csrrs reg32 , n , reg32",[0x00002073],b(5,7),bu(12,20),b(5,15)],
["csrrc reg32 , n , reg32",[0x00003073],b(5,7),bu(12,20),b(5,15)],
["csrrwi reg32 , n , n",[0x00005073],b(5,7),bu(12,20),bu(5,15)],
["csrrsi reg32 , n , n",[0x00006073],b(5,7),bu(12,20),bu(5,15)],
["csrrci reg32 , n , n",[0x00007073],b(5,7),bu(12,20),bu(5,15)],
["cpsid",[0x30047073]],
["cpsie",[0x30046073]],

["fence",[0x0FF0000F]],
["fence.tso",[0x8330000F]],
["ecall",[0x00000073]],
["ebreak",[0x00100073]],
["mret",[0x30200073]],

["if m0 goto n",[0xe0002fb7],n(11,16,-3,1)],

["iaddrw n",0,na(16,0)],
["iaddrl n",[0],na(32,0)],
["daddrw n",0,na(16,0)],
["daddrl n",[0],na(32,0)],
];

const patlist_m0 = [];
const patlist_rv32c = [];
for (let i = 0; i < cmdlist_m0.length; i++){
	patlist_m0.push(patfactory(cmdlist_m0[i][0]));
}
for (let i = 0; i < cmdlist_rv32c.length; i++){
	patlist_rv32c.push(patfactory(cmdlist_rv32c[i][0]));
}

let cmdlist, patlist;

//
function getSize(lines, outlist){
	let n = 0;
	for (let i = 0; i < outlist.length; i++) {
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		if(p==EMPTYLINE){
			continue;
		} else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
		} else {
//			bas += "[" + n + "]=`" + zero2w(p) + "\n";// + " '" + line + "\n";
//			bas += "[" + n + "]=`" + zero2(p >> 8) + " " + zero2(p & 0xff) + " :'" + line + "\n";
			n++;
		}
	}
	return n * 2;
}

function cutComment(s) {
	const n = s.indexOf("'");
	if (n < 0)
		return s;
	return s.substring(0, n);
};

function asmln(ln, prgctr) {
	// 命令 > 命令でない値 > 例外 の順で優先
	// それぞれ最初に出てきたものを採用
	let exc = null, result = undefined;
	ln = cutComment(ln);
	//ln=ln.toLowerCase().replace(/\s/g,"");
	for (let j = 0; j < patlist.length; j++) {
		const m = ln.match(patlist[j]);
		if (m) {
			// console.log(patlist[j] + " " + m);
			try {
				const p = build_m(cmdlist[j], m, prgctr);
				if ((p.length + 1 ? p[0] : p) >= NOTOPCODE) {
					if (result == undefined) result = p;
				} else {
					return p;
				}
			} catch (e) {
				if (exc == null) exc = e;
			}
		}
	}
	if (result == undefined && exc != null) throw exc;
	return result;

}
function pint(s) {
//	try {
		const n = s.indexOf("'");
		if (n >= 0) {
			s = s.substring(0, n);
		}
		//const s_orig = s;
		s = s.replace(/#/g,"0x").replace(/`/g,"0b");
		return parseInt(eval(s));
		// eval を用いることで 1+2 などの式にも対応できるが、
		// 自前のパースでは式への対応は難しい
		/*
		let mult = 1;
		if (s.substring (0, 1) === "+") {
			s = s.substring(1);
		} else if (s.substring(0, 1) === "-") {
			s = s.substring(1);
			mult = -1;
		}
		let radix = 10;
		if (s.substring(0, 2) === "0x") {
			s = s.substring(2);
			radix = 16;
		} else if (s.substring(0, 2) === "0b") {
			s = s.substring(2);
			radix = 2;
		} else if (s.substring(0, 2) === "0o") {
			s = s.substring(2);
			radix = 8;
		} else if (s.substring(0, 1) === "0" && s !== "0") {
			s = s.substring(1);
			radix = /[89]/.test(s) ? 10 : 8;
		}
		// 区切りの _ を消去する (先頭・末尾・連続は不可)
		s = s.replace(/(?<=[^_])_(?=[^_])/g, "");
		if (!new RegExp("^[" + "0123456789abcdef".substring(0, radix) + "]+$").test(s)) {
			throw new Error("invalid number: " + s_orig);
		}
		return parseInt(s, radix) * mult;
		*/
//	} catch (e) {
//		alert("err: " + s);
//		return null;
//	}
}

function pdat(ln,pc){
	const insnInfo = /^\s*(u?)\s*d\s*a\s*t\s*a\s*([bwl]?)/i.exec(ln);
	if (!insnInfo) throw new Error("invalid instruction");
	const align = insnInfo[1].toLowerCase() !== "u";
	const dtype = insnInfo[2].toLowerCase();
	const sz_dict={"b":1,"w":2,"l":4};
	const sz = dtype in sz_dict ? sz_dict[dtype] : 1;

	let i,d,ret=[];
	const msk=Math.pow(2,8*sz)-1;
	let start = insnInfo[0].length, strMode = false;
	for (i = start; i <= ln.length; i++) {
		if (i >= ln.length || (!strMode && (ln.charAt(i) === "," || ln.charAt(i) === "'"))) {
			const part = ln.substring(start, i);
			if (part.replace(/^\s*/, "").charAt(0) === "\"") {
				const str = JSON.parse(part);
				if (typeof str !== "string") throw new Error("invalid data");
				new TextEncoder().encode(str).forEach((d) => ret.push(d & msk));
			} else {
				d = pint(part.replace(/\s/g, ""));
				ret.push(d & msk);
			}
			start = i + 1;
			if (ln.charAt(i) === "'") break; // この後はコメントなので終了
		} else if (strMode && ln.charAt(i) === "\\") {
			i++; // エスケープシーケンス \" が文字列の終わりと誤認識されるのを防ぐ
		} else if (ln.charAt(i) === "\"") {
			strMode = !strMode;
		}
	}

	const _ret = ret;
	ret = [];

	//align
	if (align && pc % 4 == 2) {
		ret.unshift(0);
	};
	if (sz==1) {
		if(_ret.length%2){
			_ret.push(0);
		};
		for(i=0;i<_ret.length;i+=2){
			ret.push(_ret[i]|(_ret[i+1]<<8));
		}
	} else if (sz == 2){
		for(i=0;i<_ret.length;i++) {
			ret.push(_ret[i]);
		}
	} else if (sz == 4){
		for (i = 0; i < _ret.length; i++){
			ret.push(_ret[i] & 0xffff);
			ret.push((_ret[i] >> 16) & 0xffff);
		}
	}
	return ret;

}

function checksum_lsum2comp(bytes) {
	if (bytes.length % 4 !== 0) {
		throw new Error("length must be multiple of 4 for this type of checksum");
	}
	let sum = 0;
	for (let i = 0; i < bytes.length; i += 4) {
		const delta = bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24);
		sum = (sum + delta) >>> 0;
	}
	const checksum = -sum;
	return [checksum & 0xffff, checksum >>> 16];
}

const crc32magic = 0xedb88320;
const crc32table = [];
function checksum_crc32(bytes) {
	if (crc32table.length === 0) {
		for (let i = 0; i < 256; i++) {
			let value = i;
			for (let j = 0; j < 8; j++) {
				value = (value >>> 1) ^ (value & 1 ? crc32magic : 0);
			}
			crc32table.push(value);
		}
	}
	let crc = 0xffffffff;
	for (let i = 0; i < bytes.length; i++) {
		crc = crc32table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
	}
	crc = ~crc;
	return [crc & 0xffff, crc >>> 16];
}

const crc32mpeg2magic = 0x04c11db7;
const crc32mpeg2table = [];
function checksum_crc32mpeg2(bytes) {
	if (crc32mpeg2table.length === 0) {
		for (let i = 0; i < 256; i++) {
			let value = i << 24;
			for (let j = 0; j < 8; j++) {
				value = (value << 1) ^ (value & 0x80000000 ? crc32mpeg2magic : 0);
			}
			crc32mpeg2table.push(value);
		}
	}
	let crc = 0xffffffff;
	for (let i = 0; i < bytes.length; i++) {
		crc = crc32mpeg2table[((crc >>> 24) ^ bytes[i]) & 0xff] ^ (crc << 8);
	}
	return [crc & 0xffff, crc >>> 16];
}

const checksum_dict = {
	"lsum2comp": { "func": checksum_lsum2comp, "size": 4 },
	"crc32": { "func": checksum_crc32, "size": 4 },
	"crc32mpeg2": { "func": checksum_crc32mpeg2, "size": 4 },
};

function assemble(s, fmt, options) {
	lbl_dict = {};
	//lbl_align4 = [];
	const outlist = [];
	let prgctr = 0;
	const lists = {
		"m0": {"cmdlist": cmdlist_m0, "patlist": patlist_m0},
		"rv32c": {"cmdlist": cmdlist_rv32c, "patlist": patlist_rv32c}
	};
	let curlist = lists["m0"];
	cmdlist = curlist.cmdlist;
	patlist = curlist.patlist;
	const fm2b = my_fmt_dict[fmt].func;
	s = s.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
	const lines = s.split("\n");
	prgctr = !options || typeof options.startAddress === "undefined" ? 0x700 :
		typeof options.startAddress === "number" ? options.startAddress : pint(options.startAddress);
	const startadr = prgctr;
	const errors = [];

	const orglines = [];
	for (let i = 0; i < lines.length; i++) {
		orglines.push(lines[i]);
	}
	
	const pats = [];
	for (let i = 0; i < lines.length; i++) {
		pats.push(curlist);
		const line = lines[i].toLowerCase().replace(/\s/g,"");
		lines[i] = line;

		try {
			if (line.charAt(0) == "@") {
				/*
				console.log("@put ", line, prgctr, lbl_align4);
				if (lbl_align4.indexOf(line) >= 0) {
						if (prgctr % 4 == 2) {
						outlist.push([i, prgctr, 0]);
						prgctr += 2;
					}
				}
				*/
				lbl_dict[cutComment(line)] = prgctr;
				outlist.push([i,prgctr,LABEL]);
				continue;
			} else if (line.charAt(0) == "'" || line.slice(0,3) == "rem"){
				outlist.push([i,prgctr,COMMENT]);
				continue;
			} else if (line.slice(0,4) == "data" || line.slice(0,5) == "udata") {
				const align = line.charAt(0) != "u";
				if (align && prgctr % 2 == 1) {
					prgctr++;
				}
				const dlist = pdat(orglines[i], prgctr);
				for (let j = 0; j < dlist.length; j++){
					outlist.push([i, prgctr, dlist[j]]);
					prgctr += 2;
				}
				continue;
			} else if (line.slice(0,4) == "mode") {
				outlist.push([i,prgctr,DIRECTIVE]);
				const mode = cutComment(line.substr(4));
				if (mode in lists) {
					curlist = lists[mode];
					cmdlist = curlist.cmdlist;
					patlist = curlist.patlist;
				} else {
					throw new Error("unknown mode " + mode);
				}
				continue;
			} else if (line.slice(0,3) == "org") {
				const is_r = line.substr(3,1) == "r";
				outlist.push([i,prgctr,DIRECTIVE]);
				const new_prgctr = (is_r ? startadr : 0) + pint(cutComment(line.substr(is_r ? 4 : 3)));
				prgctr = new_prgctr;
				continue;
			} else if (line.slice(0,5) == "align") {
				const is_r = line.substr(5,1) == "r";
				const parts = cutComment(line.substr(is_r ? 6 : 5)).split(/,/);
				const a = pint(parts[0]);
				const b = parts.length >= 2 ? pint(parts[1]) : 0;
				const c = parts.length >= 3 ? pint(parts[2]) : null;
				let new_prgctr = prgctr, r = (is_r ? prgctr - startadr : prgctr) % a;
				if (r < 0) r += a;
				if (a <= 0 || b < 0) {
					throw new Error("invalid parameter");
				}
				if (r < b) {
					new_prgctr += b - r;
				} else if (r > b) {
					new_prgctr += b + a - r;
				}
				if (c == null || prgctr + 2 > new_prgctr) {
					outlist.push([i,prgctr,DIRECTIVE]);
					prgctr = new_prgctr;
				} else {
					while (prgctr + 2 <= new_prgctr) {
						outlist.push([i,prgctr,c]);
						prgctr += 2;
					}
					prgctr = new_prgctr;
				}
				continue;
			} else if (line.slice(0,5) == "space") {
				const parts = cutComment(line.substr(5)).split(/,/);
				const a = pint(parts[0]);
				const b = parts.length >= 2 ? pint(parts[1]) : null;
				const new_prgctr = prgctr + a;
				if (b == null || prgctr + 2 > new_prgctr) {
					outlist.push([i,prgctr,DIRECTIVE]);
					prgctr = new_prgctr;
				} else {
					while (prgctr + 2 <= new_prgctr) {
						outlist.push([i,prgctr,b]);
						prgctr += 2;
					}
					prgctr = new_prgctr;
				}
				continue;
			} else if (line.slice(0,8) == "checksum") {
				const is_r = line.substr(8,1) == "r";
				const parts = cutComment(line.substr(is_r ? 9 : 8)).split(/,/);
				if (!(parts[2] in checksum_dict)) {
					throw new Error("unknown kind: " + parts[2]);
				}
				const start = pint(parts[0]) + (is_r ? startadr : 0);
				const length = pint(parts[1]);
				const kind = checksum_dict[parts[2]];
				const defaultByte = parts.length >= 4 ? pint(parts[3]) : null;
				outlist.push([i,prgctr,CHECKSUM,{
					"start": start,
					"length": length,
					"func": kind.func,
					"defaultByte": defaultByte,
				}]);
				prgctr += 2;
				for (let j = 2; j < kind.size; j += 2) {
					outlist.push([i,prgctr,CHECKSUM]);
					prgctr += 2;
				}
			} else if (line.slice(0,9) == "uf2family") {
				const family = cutComment(line.substr(9));
				outlist.push([i,prgctr,DIRECTIVE,{"uf2family": family === "none" ? null : pint(family)}]);
			} else if (line.slice(0,8) == "uf2block") {
				const args = cutComment(line.substr(8));
				if (args === "none") {
					outlist.push([i,prgctr,DIRECTIVE,{"uf2block": null}]);
				} else {
					const parts = args.split(/,/);
					if (parts.length !== 2 && parts.length !== 3) {
						throw new Error("invalid number of arguments");
					}
					const blockSize = pint(parts[0]);
					const sectorSize = parts.length === 3 ? pint(parts[1]) : blockSize;
					if (blockSize <= 0 || sectorSize % blockSize !== 0) {
						throw new Error("invalid block/sector size");
					}
					const defaultByte = pint(parts[parts.length === 3 ? 2 : 1]) & 0xff;
					outlist.push([i,prgctr,DIRECTIVE,{"uf2block": {
						"blockSize": blockSize,
						"sectorSize": sectorSize,
						"defaultByte": defaultByte,
					}}]);
				}
			} else if (line == "") {
				outlist.push([i,prgctr,EMPTYLINE]);
				continue;
			} else {
				const p = asmln(line, prgctr);
				
				if (p != undefined) {
					if (p.length + 1) {
						// array is returned
						for (let j = 0; j < p.length; j++) {
							outlist.push([ i, prgctr, p[j] ]);
							prgctr += 2;
						}
					} else {
						outlist.push([ i, prgctr, p ]);
						prgctr += 2;
					}
				} else {
					throw line; // alert("asm error: " + line);
				}
			}
		} catch (e) {
			errors.push("asm error in " + (i + 1) + "\n" + orglines[i] + "\n" + e);
		}
	}
	
	for (let i = 0; i < outlist.length; i++){
		const lno = outlist[i][0];
		const prgctr = outlist[i][1];
		let p = outlist[i][2];
		const line = lines[lno].toLowerCase();
//		console.log(lines[i] + " " + prgctr + " " + p.toString(16));
		
		if (p >= NOTOPCODE) {
		}
		if (p == YET) {
			try {
				cmdlist = pats[lno].cmdlist;
				patlist = pats[lno].patlist;
				p = asmln(line,prgctr);
				if (p != undefined && p.length + 1) {
					// multiple-word instruction
					for (let j = 0; j < p.length; j++) {
						outlist[i+j] = [ lno, prgctr+2*j, p[j] ];
						
						if (outlist[i+j][2] == YET) {
							errors.push("label not found in " + (lno + 1) + "\n" + orglines[lno]);
						}
					}
					i += p.length - 1;
				} else {
					outlist[i] = [ lno, prgctr, p ];
					
					if (outlist[i][2] == YET) {
						errors.push("label not found in " + (lno + 1) + "\n" + orglines[lno]);
					}
				}
			} catch (e) {
				errors.push("asm error in " + (lno + 1) + "\n" + orglines[lno] + "\n" + e);
			}
		}
	}
	const assembledData = new Map();
	for (let i = 0; i < outlist.length; i++) {
		const prgctr = outlist[i][1];
		const p = outlist[i][2];
		if (p < NOTOPCODE) {
			assembledData.set(prgctr, p & 0xff);
			assembledData.set(prgctr + 1, (p >> 8) & 0xff);
		}
	}
	for (let i = 0; i < outlist.length; i++) {
		const lno = outlist[i][0];
		const prgctr = outlist[i][1];
		const p = outlist[i][2];
		const params = outlist[i][3];
		if (p === CHECKSUM && params) {
			try {
				const bytes = [];
				for (let j = 0; j < params.length; j++) {
					const addr = params.start + j;
					const byte = assembledData.get(addr);
					if (typeof byte === "number") {
						bytes.push(byte);
					} else if (params.defaultByte !== null) {
						bytes.push(params.defaultByte & 0xff);
					} else {
						throw new Error("value undefined at #" + addr.toString(16) + " and default value isn't provided");
					}
				}
				const checksum = params.func(bytes);
				for (let j = 0; j < checksum.length; j++) {
					outlist[i + j] = [lno, prgctr + 2 * j, checksum[j]];
				}
				i += checksum.length - 1;
			} catch (e) {
				errors.push("asm error in " + (lno + 1) + "\n" + orglines[lno] + "\n" + e);
			}
		}
	}
	//console.log(outlist);
	const useLineno = options && typeof options.useLineno !== "undefined" ? options.useLineno : true;
	const linenoStart = !options || typeof options.linenoStart === "undefined" ? 10 :
		typeof options.linenoStart === "number" ? options.linenoStart : pint(options.linenoStart);
	const linenoDelta = !options || typeof options.linenoDelta === "undefined" ? 10 :
		typeof options.linenoDelta === "number" ? options.linenoDelta : pint(options.linenoDelta);
	let bas = "";
	try {
		bas = fm2b(lines, outlist, useLineno ? linenoStart : NaN, useLineno ? linenoDelta : NaN);
	} catch (e) {
		errors.push("" + e);
	}
	return {
		bas: bas,
		size: getSize(lines, outlist),
		errors: errors,
	};
}

if (typeof module !== "undefined") {
	module.exports = {
		assemble,
	};
}
