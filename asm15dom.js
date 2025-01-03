"use strict";

function run_assemble() {
	const dom_src=document.getElementById("textarea1");
	const dom_fmt=document.getElementById("selfmt");
	const dom_hex=document.getElementById("textarea2");
	const dom_adr=document.getElementById("txtadr");
	const dom_len=document.getElementById("uselineno");
	const dom_lst=document.getElementById("linenostart");
	const dom_lde=document.getElementById("linenodelta");
	dom_hex.innerHTML=""
	const result = assemble(dom_src.value, dom_fmt.value, {
		startAddress: dom_adr.value,
		useLineno: dom_len.checked,
		linenoStart: dom_lst.value,
		linenoDelta: dom_lde.value,
	});
	if (result.errors.length > 0) alert(result.errors.join("\n\n"));
	const bas = result.bas;
	if (bas instanceof ArrayBuffer) {
		const basView = new Uint8Array(bas);
		let hexdumped = "";
		for (let i = 0; i < basView.length; i += 16) {
			const address = "0000000" + i.toString(16);
			hexdumped += address.substring(address.length - 8) + " ";
			let hexs = "", chars = "";
			for (let j = 0; j < 16 && i + j < basView.length; j++) {
				const v = basView[i + j];
				const hex = "0" + v.toString(16);
				hexs += " " + hex.substring(hex.length - 2);
				chars += 0x20 <= v && v < 0x7f ? String.fromCharCode(v) : ".";
			}
			hexdumped += hexs;
			for (let i = hexs.length; i < 3 * 16; i += 3) hexdumped += "   ";
			hexdumped += "  |" + chars + "|\n";
		}
		dom_hex.value = hexdumped;
	} else {
		dom_hex.value = bas;
	}
	binsize.textContent = result.size;
	/*
	if (dom_hex.textContent==bas)
		return;
	dom_hex.textContent = bas;
	if (dom_hex.textContent==bas)
		return;
	dom_hex.innerText=bas;
	if (dom_hex.innerText==bas)
		return;
	dom_hex.innerHTML=bas;
	if (dom_hex.innerHTML==bas)
		return;
	*/
}

function example() {
	const dom_src = document.getElementById("textarea1");
	const dom_ex = document.getElementById("selex");
	const exname = dom_ex.value;
	if (!exname) {
		return false;
	}
	fetch("samples/" + exname + ".asm")
		.then(res => res.text())
		.then(text => dom_src.value = text);
}
