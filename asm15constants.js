"use strict";

//GLOBAL
const constants = {
NOTOPCODE : 0x100000000 + 0,
YET       : 0x100000000 + 1,
COMMENT   : 0x100000000 + 2,
EMPTYLINE : 0x100000000 + 3,
ASMERR    : 0x100000000 + 4,
LABEL     : 0x100000000 + 5,
DIRECTIVE : 0x100000000 + 6,
CHECKSUM  : 0x100000000 + 7,
};

const globalObject = (() => {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
	return self;
})();

for (const key in constants) {
	globalObject[key] = constants[key];
}
