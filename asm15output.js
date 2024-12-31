"use strict";

function lno(start,delta,cnt) {
	if (isNaN(start) || isNaN(delta)) return "";
	return (start + delta * cnt).toString(10) + " ";
}
function zero16(x) {
	x = x & 0xff;
	let p = x.toString(16).toUpperCase();
	p = "00".substr(0, 2 - p.length) + p;
	return p;
}
function zero2(x){
	let p=x.toString(2);
	p="00000000".substr(0,8-p.length)+p;
	return p;
}
function zero2w(x){
	let p=x.toString(2);
	p="0000000000000000".substr(0,16-p.length)+p;
	return p;
}
function m2b16(lines,outlist,s,d){
	let bas="";
	let lines2=[],linehex=[],lineadr=-1;

	let nln=0;
	
	for(let i=0; i<outlist.length; i++){
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		let flush = false;
		if(p==EMPTYLINE){
			continue;
		}else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
			continue
		}else if(lineadr<0 || lineadr+linehex.length==a){
			if(lineadr<0){
				lineadr=a;
			}
			let p0=p&0x0ff;
			let p1=(p>>8)&0x0ff
			p0=zero16(p0);
			p1=zero16(p1);
			linehex.push("#"+p0);
			linehex.push("#"+p1);
		}else{
			flush = true;
			i--;
		}
		if(linehex.length>=8 || flush){
			lines2.push(lno(s,d,nln)+"POKE#"+lineadr.toString(16).toUpperCase()+
			","+linehex.join(","));
			linehex=[];
			nln++;
			lineadr=-1;
		}
	}
	if(linehex.length>0){
		lines2.push(lno(s,d,nln)+"POKE#"+lineadr.toString(16).toUpperCase()+
		","+linehex.join(","));
	}
	lines2.push("");

	bas=lines2.join("\n");
	return bas;
}
function m2b10(lines,outlist,s,d){
	let bas="";
	let lines2=[],linehex=[],lineadr=-1;

	let  nln = 0;
	
	for (let i = 0; i < outlist.length; i++){
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];
		
		if (p==EMPTYLINE) {
			continue;
		} else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
		 	continue
		} else {
			let flush = false;
			if(lineadr < 0 || lineadr+linehex.length==a){
				if (lineadr < 0) {
					lineadr = a;
				}
				const p0 = p & 0x0ff;
				const p1 = (p >> 8) & 0x0ff
				linehex.push(p0.toString(10));
				linehex.push(p1.toString(10));
			} else {
				flush = true;
				i--;
			}
			
			const ln = lno(s,d,nln) + "POKE#" + lineadr.toString(16).toUpperCase() + "," + linehex.join(",");
			if (ln.length > 200 - 8 || flush) {
//			if (linehex.length == 40) {
				lines2.push(ln);
				lineadr = -1;
				linehex=[];
				nln++;
			}
		}
	}
	if (linehex.length > 0) {
		lines2.push(lno(s,d,nln) + "POKE#" + lineadr.toString(16).toUpperCase() +","+linehex.join(","));
	}
	lines2.push("");

	bas=lines2.join("\n");
	return bas;
}
function m2b2(lines, outlist,s,d){
	let bas = "";
	for (let i = 0; i < outlist.length; i++) {
		const out = outlist[i];
		const l = out[0];
		const a = out[1];
		const p = out[2];
		const line = lines[l];

		if (p==EMPTYLINE) {
			continue;
		} else if (p === undefined || p === null || p === false || p >= NOTOPCODE) {
			bas += lno(s,d,i).replace(/ $/, "") + "'" + line + "\n";
		} else {
			let p0 = p & 0x0ff;
			let p1 = (p >> 8) & 0x0ff;
			p0 = zero2(p0);
			p1 = zero2(p1);
			bas += lno(s,d,i) + "POKE#" + a.toString(16).toUpperCase() + ",`" + p0 + ",`" + p1+" :'" + line + "\n";
		}
	}
	return bas;
}
function m2bin(lines,outlist){
	let bas="";
	let paddr=-1;
	for(let i=0; i<outlist.length; i++){
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		if(p==EMPTYLINE){
			continue;
		}else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
		}else{
			if(paddr<0){
				paddr=a;
			} else if(paddr!=a){
				if ((a-paddr)%2!=0) {
					return "misalignment not supported in this format";
				}
				bas+="*** "+(a-paddr)+"-byte gap ***\n";
				paddr=a;
			}
			let p0=p&0x0ff;
			let p1=(p>>8)&0x0ff
			p0=zero2(p0);
			p1=zero2(p1);
			bas+=""+p1+p0+"\n";
			paddr+=2;
		}
	}
	return bas;
}
function m2ar2(lines,outlist){
	let bas="";
	let minaddr = 0;
	for (let i = 0; i < outlist.length; i++) {
		if (i == 0 || outlist[i][1] < minaddr) minaddr = outlist[i][1];
	}
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
			if ((a - minaddr) % 2 != 0) {
				return "misalignment not supported in this format";
			}
			const n = (a - minaddr) >> 1;
//			bas += "[" + n + "]=`" + zero2w(p) + "\n";// + " '" + line + "\n";
			bas += "[" + n + "]=`" + zero2(p >> 8) + " " + zero2(p & 0xff) + " :'" + line + "\n";
		}
	}
	return bas;
}
function m2ar16(lines,outlist,s,d) {
	let bas="";
	let linehex=[];
	let lineaddr = -1;
	let minaddr = 0;
	for (let i = 0; i < outlist.length; i++) {
		if (i == 0 || outlist[i][1] < minaddr) minaddr = outlist[i][1];
	}
	
	const limit = 30;
	let nln = 0;
	for (let i = 0; i < outlist.length; i++) {
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		if(p==EMPTYLINE) {
			continue;
		} else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
		} else {
			let flush = false;
			if (lineaddr<0 || lineaddr+linehex.length*2==a){
				if (lineaddr<0) lineaddr=a;
				const hex = "000" + p.toString(16).toUpperCase();
				linehex.push("#" + hex.substring(hex.length - 4));
			} else {
				flush=true;
				i--;
			}
			
			if (linehex.length == limit || flush) {
				if ((lineaddr - minaddr) % 2 != 0) {
					return "misalignment not supported in this format";
				}
				const n = (lineaddr - minaddr) >> 1;
				bas += lno(s,d,nln) + "LET[" + n + "]," + linehex.join(",") + "\n";
				nln++;
				linehex = [];
				lineaddr=-1;
			}
		}
	}
	if (linehex.length > 0) {
		if ((lineaddr - minaddr) % 2 != 0) {
			return "misalignment not supported in this format";
		}
		const n = (lineaddr - minaddr) >> 1;
		bas += lno(s,d,nln) + "LET[" + n + "]," + linehex.join(",") + "\n";
	}
	return bas;
}
function m2armin(lines,outlist,s,d) {
	let bas="";
	let curline = "";
	let curaddr = -1;
	let minaddr = 0;
	for (let i = 0; i < outlist.length; i++) {
		if (i == 0 || outlist[i][1] < minaddr) minaddr = outlist[i][1];
	}

	let nln = 0;
	for (let i = 0; i < outlist.length; i++) {
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		if(p==EMPTYLINE) {
			continue;
		} else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
		} else {
			if (curaddr<0) {
				if ((a - minaddr) % 2 != 0) {
					return "misalignment not supported in this format";
				}
				const n = (a - minaddr) >> 1;
				curline = lno(s,d,nln) + "LET[" + n + "]";
				nln++;
				curaddr = a;
			}
			const pval = p >= 0x8000 ? p - 0x10000 : p;
			const pstr = pval <= -10000 ? "#" + (pval & 0xffff).toString(16).toUpperCase() : pval.toString(10);
			if (curaddr==a && curline.length + 1 + pstr.length <= 200) {
				curline += "," + pstr;
				curaddr += 2;
			} else {
				bas += curline + "\n";
				curaddr = -1;
				i--;
			}
		}
	}
	if (curline.length > 0) {
		bas += curline + "\n";
	}
	return bas;
}
// from http://tagiyasoft.blog.jp/asm15.js
function m2js(lines,outlist){
	let bas="";
	let lines2=[],linehex=[],lineadr=-1;
	let minaddr = 0;
	for (let i = 0; i < outlist.length; i++) {
		if (i == 0 || outlist[i][1] < minaddr) minaddr = outlist[i][1];
	}
	let supaddr = minaddr;
	
	for(let i=0; i<outlist.length; i++){
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		let flush=false;
		if(p==EMPTYLINE){
			continue;
		}else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
			continue
		}else if(lineadr<0 || lineadr+linehex.length==a){
			if(lineadr<0){
				lineadr=a;
			}
			const p0=p&0x0ff;
			const p1=(p>>8)&0x0ff
			linehex.push(p0);
			linehex.push(p1);
		}else {
			flush=true;
			i--;
		}
		if(linehex.length>=16 || flush){
			if (supaddr != lineadr) {
				lines2.push("\ta=a+"+(lineadr-supaddr));
			}
			lines2.push("\tmem(a,"
				+ linehex.join(",")
				+ ");a=a+"
				+ linehex.length
			);
			supaddr=lineadr+linehex.length;
			linehex=[];
			lineadr=-1;
		}
	}
	if (linehex.length>0) {
		if (supaddr != lineadr) {
			lines2.push("\ta=a+"+(lineadr-supaddr));
		}
		lines2.push("\tmem(a,"
			+ linehex.join(",")
//			+ ");a=a+"+ linehex.length
			+ ")"
		);

	}
	lines2.push("");

	bas = "function asm() {\n" 
		+ '\tvar a=mem(" ");\n'
		+ lines2.join( ";\n" )
		+ "\treturn mem();\n"
		+ "}\n";
	return bas;
}
// for C lang
function m2c(lines,outlist){
	let bas="";
	let lines2=[],linehex=[],lineadr=-1;
	let minaddr = 0;
	for (let i = 0; i < outlist.length; i++) {
		if (i == 0 || outlist[i][1] < minaddr) minaddr = outlist[i][1];
	}
	let supaddr = minaddr;

	for (let i=0; i<outlist.length; i++){
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		let flush=false;
		if(p==EMPTYLINE){
			continue;
		}else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
			continue
		}else if(lineadr<0 || lineadr+linehex.length==a){
			if(lineadr<0){
				lineadr=a;
			}
			const p0=p&0x0ff;
			const p1=(p>>8)&0x0ff
			linehex.push("0x" + zero16(p0));
			linehex.push("0x" + zero16(p1));
		}else {
			flush=true;
			i--;
		}
		if(linehex.length>=16 || flush){
			let setaddr = "";
			if (lineadr != supaddr) setaddr = "[" + (lineadr - minaddr) + "] = ";
			lines2.push("\t" + setaddr + linehex.join(", ") + ",");
			supaddr = lineadr+linehex.length;
			linehex=[];
			lineadr=-1;
		}
	}
	if (linehex.length>0){
		let setaddr = "";
		if (lineadr != supaddr) setaddr = "[" + (lineadr - minaddr) + "] = ";
		lines2.push("\t" + setaddr + linehex.join(", "));
	}
	lines2.push("");

	bas = "__attribute__ ((aligned(2))) static const char ASM[] = {\n" 
		+ lines2.join("\n")
		+ "};\n";
	return bas;
}

// for hex file
function m2hex(lines,outlist){
	let bas="";
	let lines2=[],linehex=[],lineadr=-1,highadr=0;
	
	let chk = 0;
	for (let i=0; i<outlist.length; i++){
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		let flush=false;
		if(p==EMPTYLINE){
			continue;
		}else if(p===undefined||p===null||p===false||p>=NOTOPCODE){
			continue
		}else if(lineadr<0 || lineadr+linehex.length==a){
			if(lineadr<0){
				lineadr=a;
			}
			const p0=p&0x0ff;
			const p1=(p>>8)&0x0ff
			linehex.push(zero16(p0));
			linehex.push(zero16(p1));
			chk -= p0 + p1;
		}else {
			flush=true;
			i--;
		}
		if (linehex.length>=16 || flush){
			const hadr = (lineadr >> 16) & 0xffff;
			if (hadr != highadr) {
				const hadr1 = hadr >> 8;
				const hadr2 = hadr & 0xff;
				lines2.push(":02000004" + zero16(hadr1) + zero16(hadr2) + zero16(-(0x02 + 0x04 + hadr1 + hadr2) & 0xff));
				highadr = hadr;
			}
			const ad1 = lineadr >> 8;
			const ad2 = lineadr & 0xff;
			chk -= linehex.length + ad1 + ad2;
			lines2.push(":" + zero16(linehex.length) + zero16(ad1) + zero16(ad2) + "00" + linehex.join("") + zero16(chk & 0xff));
			chk = 0;
			linehex=[];
			lineadr=-1;
		}
	}
	if (linehex.length > 0) {
		const hadr = (lineadr >> 16) & 0xffff;
		if (hadr != highadr) {
			const hadr1 = hadr >> 8;
			const hadr2 = hadr & 0xff;
			lines2.push(":02000004" + zero16(hadr1) + zero16(hadr2) + zero16(-(0x02 + 0x04 + hadr1 + hadr2) & 0xff));
			highadr = hadr;
		}
		const ad1 = lineadr >> 8;
		const ad2 = lineadr & 0xff;
		chk -= linehex.length + ad1 + ad2;
		lines2.push(":" + zero16(linehex.length) + zero16(ad1) + zero16(ad2) + "00" + linehex.join("") + zero16(chk & 0xff));
	}
	lines2.push("");

	bas = lines2.join("\n") + ":00000001FF\n";
	return bas;
}

// for mot file
function m2mot(lines, outlist) {
	let bas="";
	let lines2=[],linehex=[],lineadr=-1;
	let startadr = -1;
	
	let chk = 0;
	for (let i = 0; i < outlist.length; i++) {
		const out=outlist[i];
		const l=out[0];
		const a=out[1];
		const p=out[2];
		const line=lines[l];

		let flush=false;
		if (p==EMPTYLINE) {
			continue;
		} else if (p===undefined||p===null||p===false||p>=NOTOPCODE) {
			continue
		} else if(lineadr < 0 || lineadr+linehex.length==a){
			if (lineadr < 0) {
				if (startadr < 0)
					startadr = a;
				lineadr = a;
			}
			const p0=p&0x0ff;
			const p1=(p>>8)&0x0ff
			linehex.push(zero16(p0));
			linehex.push(zero16(p1));
			chk += p0 + p1;
		} else {
			flush=true;
			i--;
		}
		if (linehex.length >= 16 || flush) {
			const ad1 = (lineadr >> 24) & 0xff;
			const ad2 = (lineadr >> 16) & 0xff;
			const ad3 = (lineadr >> 8) & 0xff;
			const ad4 = lineadr & 0xff;
			chk += linehex.length + ad1 + ad2 + ad3 + ad4;
			const len = linehex.length + 5;
			lines2.push("S3" + zero16(len) + zero16(ad1) + zero16(ad2) + zero16(ad3) + zero16(ad4) + linehex.join("") + zero16(~chk));
			chk = 0;
			linehex=[];
			lineadr=-1;
		}
	}
	if (linehex.length > 0) {
		const ad1 = (lineadr >> 24) & 0xff;
		const ad2 = (lineadr >> 16) & 0xff;
		const ad3 = (lineadr >> 8) & 0xff;
		const ad4 = lineadr & 0xff;
		chk += linehex.length + ad1 + ad2 + ad3 + ad4;
		const len = linehex.length + 5;
		lines2.push("S3" + zero16(len) + zero16(ad1) + zero16(ad2) + zero16(ad3) + zero16(ad4) + linehex.join("") + zero16(~chk));
	}
	const ad1 = (startadr >> 24) & 0xff;
	const ad2 = (startadr >> 16) & 0xff;
	const ad3 = (startadr >> 8) & 0xff;
	const ad4 = startadr & 0xff;
	chk = 4 + ad1 + ad2 + ad3 + ad4; // dummy
	lines2.push("S704" + zero16(ad1) + zero16(ad2) + zero16(ad3) + zero16(ad4) + zero16(~chk));
	lines2.push("");

	bas = lines2.join("\n");
	return bas;
}

const fmt_dict = {
	"bas2": m2b2, "bas16": m2b16, "bas10": m2b10, "basar2": m2ar2, "basar16": m2ar16, "basarmin": m2armin, "bin": m2bin, "latte": m2js, "c": m2c, "hex": m2hex, "mot": m2mot
};
