"use strict";

/*
以下のフォントセット2個は、
CC BY ( https://creativecommons.org/licenses/by/4.0/ )に基づき、
『IchigoJam キャラクターコード一覧 - イチゴジャム レシピ』
https://15jamrecipe.jimdo.com/%E3%83%84%E3%83%BC%E3%83%AB/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E3%82%B3%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7/
で公開されている書面から変換して作成したものです。

この変換結果のライセンスは、CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/deed.ja ) とします。
変換者：みけCAT
*/

// 「IchigoJam BASIC 〜1.1.1 版」 IchigoJam キャラクター一覧 20160504.pdf より変換
// 変換元のクレジット(2016/05/04版なのに2016.04.23となっていますが、原文ママです):
//   IchigoJam FONT(Original): CC BY IchigoJam(http://ichigojam.net/)
//   CC BY 製作 ふうせん Fu-sen. (志賀 慶一) イチゴジャム レシピ(http://15jamrecipe.jimdo.com/) 2016.04.23
const ijfont_1_1 = [
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,
	0x55,0xaa,0x55,0xaa,0x55,0xaa,0x55,0xaa,
	0xaa,0xaa,0xaa,0xaa,0xaa,0xaa,0xaa,0xaa,
	0xff,0x00,0xff,0x00,0xff,0x00,0xff,0x00,
	0x18,0x18,0x3c,0x5a,0x5a,0x24,0x24,0x66,
	0x00,0x18,0x7e,0x99,0x18,0x3c,0x24,0x66,
	0x00,0x18,0x1a,0x7e,0x50,0x1c,0x14,0x66,
	0x18,0x18,0x10,0x10,0x10,0x10,0x10,0x18,
	0x00,0x18,0x58,0x7e,0x0a,0x18,0x2e,0x62,
	0x18,0x18,0x08,0x08,0x08,0x08,0x08,0x18,
	0x3c,0x66,0xc3,0x81,0x81,0xc3,0x66,0x3c,
	0x3c,0x42,0x81,0xa5,0x81,0x7e,0x24,0x66,
	0x00,0x7e,0x7e,0x7e,0x7e,0x7e,0x7e,0x00,
	0x00,0x7e,0x42,0x42,0x42,0x42,0x7e,0x00,
	0x08,0x5a,0x6c,0xfe,0x3c,0x7e,0x4a,0x11,
	0x1c,0x26,0x26,0x26,0x26,0x26,0x26,0x1c,
	0x18,0x18,0x18,0xff,0xff,0x00,0x00,0x00,
	0x00,0x00,0x00,0xff,0xff,0x18,0x18,0x18,
	0x18,0x18,0x18,0xf8,0xf8,0x18,0x18,0x18,
	0x18,0x18,0x18,0x1f,0x1f,0x18,0x18,0x18,
	0x18,0x18,0x18,0xff,0xff,0x18,0x18,0x18,
	0x18,0x18,0x18,0x18,0x18,0x18,0x18,0x18,
	0x00,0x00,0x00,0xff,0xff,0x00,0x00,0x00,
	0x00,0x00,0x00,0x1f,0x1f,0x18,0x18,0x18,
	0x00,0x00,0x00,0xf8,0xf8,0x18,0x18,0x18,
	0x18,0x18,0x18,0x1f,0x1f,0x00,0x00,0x00,
	0x18,0x18,0x18,0xf8,0xf8,0x00,0x00,0x00,
	0x18,0x38,0x78,0xff,0xff,0x78,0x38,0x18,
	0x18,0x1c,0x1e,0xff,0xff,0x1e,0x1c,0x18,
	0x18,0x3c,0x7e,0xff,0xff,0x18,0x18,0x18,
	0x18,0x18,0x18,0xff,0xff,0x7e,0x3c,0x18,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x20,0x20,0x20,0x20,0x20,0x00,0x20,0x00,
	0x50,0x50,0x00,0x00,0x00,0x00,0x00,0x00,
	0x50,0x50,0xf8,0x50,0xf8,0x50,0x50,0x00,
	0x20,0x78,0xa0,0x70,0x28,0xf0,0x20,0x00,
	0xc0,0xc8,0x10,0x20,0x40,0x98,0x18,0x00,
	0x40,0xa0,0xa0,0x40,0xa8,0x90,0x68,0x00,
	0x10,0x20,0x40,0x00,0x00,0x00,0x00,0x00,
	0x10,0x20,0x40,0x40,0x40,0x20,0x10,0x00,
	0x40,0x20,0x10,0x10,0x10,0x20,0x40,0x00,
	0x20,0xa8,0x70,0x20,0x70,0xa8,0x20,0x00,
	0x00,0x20,0x20,0xf8,0x20,0x20,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x20,0x20,0x40,
	0x00,0x00,0x00,0xf8,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x60,0x60,0x00,
	0x00,0x00,0x08,0x10,0x20,0x40,0x80,0x00,
	0x70,0x88,0x98,0xa8,0xc8,0x88,0x70,0x00,
	0x20,0x60,0xa0,0x20,0x20,0x20,0xf8,0x00,
	0x70,0x88,0x08,0x08,0x30,0xc0,0xf8,0x00,
	0x70,0x88,0x08,0x30,0x08,0x88,0x70,0x00,
	0x30,0x50,0x90,0x90,0x90,0xf8,0x10,0x00,
	0xf8,0x80,0xf0,0x08,0x08,0x88,0x70,0x00,
	0x70,0x80,0xf0,0x88,0x88,0x88,0x70,0x00,
	0xf8,0x88,0x08,0x10,0x10,0x20,0x20,0x00,
	0x70,0x88,0x88,0x70,0x88,0x88,0x70,0x00,
	0x70,0x88,0x88,0x88,0x78,0x08,0x70,0x00,
	0x00,0x00,0x20,0x00,0x00,0x20,0x00,0x00,
	0x00,0x00,0x20,0x00,0x00,0x20,0x20,0x40,
	0x10,0x20,0x40,0x80,0x40,0x20,0x10,0x00,
	0x00,0x00,0xf8,0x00,0xf8,0x00,0x00,0x00,
	0x40,0x20,0x10,0x08,0x10,0x20,0x40,0x00,
	0x70,0x88,0x88,0x10,0x20,0x00,0x20,0x00,
	0x70,0x88,0x08,0x68,0xa8,0xa8,0x70,0x00,
	0x70,0x88,0x88,0x88,0xf8,0x88,0x88,0x00,
	0xf0,0x48,0x48,0x70,0x48,0x48,0xf0,0x00,
	0x70,0x88,0x80,0x80,0x80,0x88,0x70,0x00,
	0xf0,0x48,0x48,0x48,0x48,0x48,0xf0,0x00,
	0xf8,0x80,0x80,0xf8,0x80,0x80,0xf8,0x00,
	0xf8,0x80,0x80,0xf8,0x80,0x80,0x80,0x00,
	0x70,0x88,0x80,0x80,0x98,0x88,0x78,0x00,
	0x88,0x88,0x88,0xf8,0x88,0x88,0x88,0x00,
	0x70,0x20,0x20,0x20,0x20,0x20,0x70,0x00,
	0x38,0x10,0x10,0x10,0x10,0x90,0x60,0x00,
	0x88,0x90,0xa0,0xc0,0xa0,0x90,0x88,0x00,
	0x80,0x80,0x80,0x80,0x80,0x80,0xf8,0x00,
	0x88,0xd8,0xd8,0xa8,0xa8,0xa8,0x88,0x00,
	0x88,0xc8,0xc8,0xa8,0x98,0x98,0x88,0x00,
	0x70,0x88,0x88,0x88,0x88,0x88,0x70,0x00,
	0xf0,0x88,0x88,0x88,0xf0,0x80,0x80,0x00,
	0x70,0x88,0x88,0x88,0xa8,0x90,0x68,0x00,
	0xf0,0x88,0x88,0x88,0xf0,0x90,0x88,0x00,
	0x70,0x88,0x80,0x70,0x08,0x88,0x70,0x00,
	0xf8,0x20,0x20,0x20,0x20,0x20,0x20,0x00,
	0x88,0x88,0x88,0x88,0x88,0x88,0x70,0x00,
	0x88,0x88,0x50,0x50,0x50,0x20,0x20,0x00,
	0x88,0x88,0xa8,0xa8,0xa8,0x50,0x50,0x00,
	0x88,0x88,0x50,0x20,0x50,0x88,0x88,0x00,
	0x88,0x88,0x50,0x20,0x20,0x20,0x20,0x00,
	0xf8,0x08,0x10,0x20,0x40,0x80,0xf8,0x00,
	0x70,0x40,0x40,0x40,0x40,0x40,0x70,0x00,
	0x00,0x00,0x80,0x40,0x20,0x10,0x08,0x00,
	0x70,0x10,0x10,0x10,0x10,0x10,0x70,0x00,
	0x20,0x50,0x88,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0xf8,0x00,
	0x40,0x20,0x10,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x70,0x08,0x78,0x88,0x74,0x00,
	0x80,0x80,0xb0,0xc8,0x88,0x88,0xf0,0x00,
	0x00,0x00,0x70,0x88,0x80,0x88,0x70,0x00,
	0x08,0x08,0x68,0x98,0x88,0x88,0x78,0x00,
	0x00,0x00,0x70,0x88,0xf8,0x80,0x70,0x00,
	0x30,0x40,0x40,0xf8,0x40,0x40,0x40,0x00,
	0x00,0x00,0x74,0x88,0x88,0x78,0x08,0x70,
	0x80,0x80,0xb0,0xc8,0x88,0x88,0x88,0x00,
	0x20,0x00,0x60,0x20,0x20,0x20,0x20,0x00,
	0x10,0x00,0x30,0x10,0x10,0x10,0x10,0x60,
	0x40,0x40,0x48,0x50,0x60,0x50,0x48,0x00,
	0x60,0x20,0x20,0x20,0x20,0x20,0x30,0x00,
	0x00,0x00,0xf0,0xa8,0xa8,0xa8,0xa8,0x00,
	0x00,0x00,0xf0,0x88,0x88,0x88,0x88,0x00,
	0x00,0x00,0x70,0x88,0x88,0x88,0x70,0x00,
	0x00,0x00,0x70,0x88,0x88,0xf0,0x80,0x80,
	0x00,0x00,0x70,0x88,0x88,0x78,0x08,0x08,
	0x00,0x00,0xb0,0xc8,0x80,0x80,0x80,0x00,
	0x00,0x00,0x78,0x80,0x70,0x08,0xf0,0x00,
	0x40,0x40,0xf8,0x40,0x40,0x40,0x30,0x00,
	0x00,0x00,0x90,0x90,0x90,0x90,0x68,0x00,
	0x00,0x00,0x88,0x88,0x50,0x50,0x20,0x00,
	0x00,0x00,0x88,0xa8,0xa8,0x50,0x50,0x00,
	0x00,0x00,0x88,0x50,0x20,0x50,0x88,0x00,
	0x00,0x00,0x88,0x88,0x50,0x50,0x20,0xc0,
	0x00,0x00,0xf8,0x10,0x20,0x40,0xf8,0x00,
	0x18,0x20,0x20,0x40,0x20,0x20,0x18,0x00,
	0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x00,
	0xc0,0x20,0x20,0x10,0x20,0x20,0xc0,0x00,
	0x00,0x00,0x40,0xa8,0x10,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0xf0,0xf0,0xf0,0xf0,0x00,0x00,0x00,0x00,
	0x0f,0x0f,0x0f,0x0f,0x00,0x00,0x00,0x00,
	0xff,0xff,0xff,0xff,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0xf0,0xf0,0xf0,0xf0,
	0xf0,0xf0,0xf0,0xf0,0xf0,0xf0,0xf0,0xf0,
	0x0f,0x0f,0x0f,0x0f,0xf0,0xf0,0xf0,0xf0,
	0xff,0xff,0xff,0xff,0xf0,0xf0,0xf0,0xf0,
	0x00,0x00,0x00,0x00,0x0f,0x0f,0x0f,0x0f,
	0xf0,0xf0,0xf0,0xf0,0x0f,0x0f,0x0f,0x0f,
	0x0f,0x0f,0x0f,0x0f,0x0f,0x0f,0x0f,0x0f,
	0xff,0xff,0xff,0xff,0x0f,0x0f,0x0f,0x0f,
	0x00,0x00,0x00,0x00,0xff,0xff,0xff,0xff,
	0xf0,0xf0,0xf0,0xf0,0xff,0xff,0xff,0xff,
	0x0f,0x0f,0x0f,0x0f,0xff,0xff,0xff,0xff,
	0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,
	0x00,0x00,0x00,0x18,0x18,0x00,0x00,0x00,
	0x00,0x00,0x00,0xff,0xff,0x00,0x00,0x00,
	0x18,0x18,0x18,0x18,0x18,0x18,0x18,0x18,
	0x18,0x18,0x18,0xff,0xff,0x18,0x18,0x18,
	0x18,0x18,0x18,0xf8,0xf8,0x18,0x18,0x18,
	0x18,0x18,0x18,0x1f,0x1f,0x18,0x18,0x18,
	0x18,0x18,0x18,0xff,0xff,0x00,0x00,0x00,
	0x00,0x00,0x00,0xff,0xff,0x18,0x18,0x18,
	0x00,0x00,0x00,0x0f,0x1f,0x18,0x18,0x18,
	0x00,0x00,0x00,0xf0,0xf8,0x18,0x18,0x18,
	0x18,0x18,0x18,0x1f,0x0f,0x00,0x00,0x00,
	0x18,0x18,0x18,0xf8,0xf0,0x00,0x00,0x00,
	0xc0,0xe0,0x70,0x38,0x1c,0x0e,0x07,0x03,
	0x03,0x07,0x0e,0x1c,0x38,0x70,0xe0,0xc0,
	0x80,0xc0,0xe0,0xf0,0xf8,0xfc,0xfe,0xff,
	0x01,0x03,0x07,0x0f,0x1f,0x3f,0x7f,0xff,
	0x88,0x50,0xf8,0x20,0xf8,0x20,0x20,0x00,
	0x00,0x00,0x00,0x00,0x38,0x28,0x38,0x00,
	0x38,0x20,0x20,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x08,0x08,0x38,0x00,
	0x00,0x00,0x00,0x00,0x20,0x10,0x08,0x00,
	0x00,0x00,0x30,0x30,0x00,0x00,0x00,0x00,
	0x7e,0x02,0x7e,0x02,0x02,0x04,0x38,0x00,
	0x00,0x00,0x7c,0x04,0x10,0x10,0x20,0x00,
	0x00,0x00,0x08,0x30,0x50,0x10,0x10,0x00,
	0x00,0x00,0x10,0x7c,0x44,0x04,0x18,0x00,
	0x00,0x00,0x00,0x7c,0x10,0x10,0x7c,0x00,
	0x00,0x00,0x08,0x7c,0x18,0x28,0x48,0x00,
	0x00,0x00,0x20,0x7c,0x24,0x10,0x10,0x00,
	0x00,0x00,0x00,0x38,0x08,0x08,0x7c,0x00,
	0x00,0x00,0x38,0x08,0x38,0x08,0x38,0x00,
	0x00,0x00,0x00,0x54,0x54,0x04,0x18,0x00,
	0x00,0x00,0x00,0xfe,0x00,0x00,0x00,0x00,
	0xfe,0x02,0x14,0x10,0x10,0x10,0x60,0x00,
	0x04,0x18,0x30,0xd0,0x10,0x10,0x10,0x00,
	0x10,0xfe,0x82,0x02,0x04,0x04,0x38,0x00,
	0x00,0x7c,0x10,0x10,0x10,0x10,0xfe,0x00,
	0x04,0xfe,0x0c,0x14,0x14,0x24,0xc4,0x00,
	0x10,0x7e,0x12,0x22,0x22,0x22,0x46,0x00,
	0x10,0xfe,0x10,0x10,0xfe,0x10,0x10,0x00,
	0x7c,0x44,0x84,0x04,0x08,0x08,0x30,0x00,
	0x40,0x7e,0x88,0x08,0x08,0x08,0x70,0x00,
	0x00,0xfc,0x04,0x04,0x04,0x04,0xfc,0x00,
	0x44,0xfe,0x44,0x44,0x04,0x08,0x30,0x00,
	0x00,0x72,0x02,0x72,0x02,0x04,0x78,0x00,
	0xfe,0x02,0x04,0x08,0x10,0x28,0xc6,0x00,
	0x40,0xfe,0x42,0x44,0x40,0x40,0x3e,0x00,
	0x42,0x42,0x22,0x22,0x04,0x04,0x18,0x00,
	0x7c,0x44,0x64,0x94,0x0c,0x08,0x30,0x00,
	0x0c,0x70,0x10,0xfe,0x10,0x10,0x60,0x00,
	0x00,0x52,0x52,0x52,0x02,0x04,0x18,0x00,
	0x7c,0x00,0xfe,0x08,0x08,0x08,0x70,0x00,
	0x20,0x20,0x20,0x38,0x24,0x20,0x20,0x00,
	0x08,0x08,0x7e,0x08,0x08,0x08,0x70,0x00,
	0x00,0x00,0x7c,0x00,0x00,0x00,0xfe,0x00,
	0xfe,0x02,0x22,0x14,0x08,0x14,0xe2,0x00,
	0x10,0xfe,0x0c,0x10,0x38,0xd6,0x10,0x00,
	0x02,0x02,0x02,0x04,0x04,0x18,0xe0,0x00,
	0x00,0x28,0x28,0x28,0x44,0x44,0x82,0x00,
	0x40,0x4e,0x70,0x40,0x40,0x40,0x3e,0x00,
	0xfe,0x02,0x02,0x04,0x04,0x08,0x70,0x00,
	0x00,0x00,0x20,0x50,0x88,0x04,0x02,0x00,
	0x10,0xfe,0x10,0x10,0x54,0x92,0x92,0x00,
	0xfe,0x02,0x02,0x44,0x28,0x10,0x08,0x00,
	0x70,0x0e,0x60,0x18,0x06,0x70,0x0e,0x00,
	0x10,0x10,0x20,0x20,0x44,0xfe,0x02,0x00,
	0x04,0x04,0x48,0x28,0x10,0x28,0xc4,0x00,
	0x7c,0x20,0x20,0xfe,0x20,0x20,0x1c,0x00,
	0x20,0xfe,0x22,0x24,0x10,0x10,0x10,0x00,
	0x00,0x7c,0x04,0x04,0x08,0x08,0xfe,0x00,
	0x00,0x7c,0x04,0x7c,0x04,0x04,0x7c,0x00,
	0x7c,0x00,0xfe,0x02,0x04,0x04,0x38,0x00,
	0x44,0x44,0x44,0x44,0x04,0x04,0x18,0x00,
	0x28,0x28,0x28,0x28,0x4a,0x4c,0x88,0x00,
	0x20,0x20,0x20,0x22,0x24,0x28,0x30,0x00,
	0x00,0xfc,0x84,0x84,0x84,0x84,0xfc,0x00,
	0xfe,0x82,0x82,0x02,0x04,0x08,0x30,0x00,
	0x00,0x82,0x42,0x22,0x04,0x08,0xf0,0x00,
	0x20,0x90,0x40,0x00,0x00,0x00,0x00,0x00,
	0xe0,0xa0,0xe0,0x00,0x00,0x00,0x00,0x00,
	0x18,0x38,0x78,0xff,0xff,0x78,0x38,0x18,
	0x18,0x1c,0x1e,0xff,0xff,0x1e,0x1c,0x18,
	0x18,0x3c,0x7e,0xff,0xff,0x18,0x18,0x18,
	0x18,0x18,0x18,0xff,0xff,0x7e,0x3c,0x18,
	0x10,0x38,0x7c,0xfe,0xfe,0x38,0x7c,0x00,
	0x00,0x6c,0xfe,0xfe,0x7c,0x38,0x10,0x00,
	0x38,0x38,0xd6,0xfe,0xd6,0x10,0x38,0x00,
	0x10,0x38,0x7c,0xfe,0x7c,0x38,0x10,0x00,
	0x3c,0x66,0xc3,0x81,0x81,0xc3,0x66,0x3c,
	0x3c,0x7e,0xff,0xff,0xff,0xff,0x7e,0x3c,
	0xb8,0xa8,0xa8,0xa8,0xa8,0xa8,0xb8,0x00,
	0x18,0x24,0x42,0x81,0xbd,0xbd,0xbd,0x7e,
	0x24,0x5a,0x42,0x81,0xa5,0x81,0x42,0x3c,
	0x3c,0x42,0x81,0xa5,0x81,0x7e,0x24,0x66,
	0x0c,0x0a,0x0a,0x08,0x78,0xf8,0x70,0x00,
	0x3c,0x42,0x99,0xa5,0xad,0xa1,0x92,0x4c,
	0x18,0x18,0x24,0x24,0x7e,0xff,0x3c,0x7e,
	0x00,0x18,0x24,0x42,0xff,0x54,0x00,0x00,
	0x10,0x10,0x08,0x08,0x10,0x10,0x08,0x08,
	0x7c,0x10,0x1e,0xb9,0xff,0x9f,0x10,0x7e,
	0x08,0x5a,0x6c,0xfe,0x3c,0x7e,0x4a,0x11,
	0x1c,0x36,0x3a,0x3a,0x3a,0x3e,0x1c,0x00,
	0x00,0x3c,0x42,0x7e,0x5a,0x42,0x7e,0x00,
	0x00,0x06,0x06,0x1e,0x1e,0x7e,0x7e,0x00,
	0x00,0x7c,0x44,0x64,0x64,0x44,0x7c,0x00,
	0x18,0x18,0x3c,0x5a,0x5a,0x3c,0x24,0x66,
	0x00,0x18,0x7e,0x99,0x18,0x3c,0x24,0x66,
	0x00,0x18,0x1a,0x7e,0x50,0x1c,0x14,0x66,
	0x18,0x18,0x10,0x10,0x10,0x10,0x10,0x18,
	0x00,0x18,0x58,0x7e,0x0a,0x18,0x2e,0x62,
	0x18,0x18,0x08,0x08,0x08,0x08,0x08,0x18,
	0x04,0x3e,0x2f,0x56,0x6a,0xd6,0xac,0xf0
];

// 「IchigoJam BASIC 1.2～1.3 版」 IchigoJam キャラクター一覧 1.2 20160504.pdf より変換
// 変換元のクレジット:
//   IchigoJam FONT(Original): CC BY IchigoJam(http://ichigojam.net/)
//   CC BY 製作 ふうせん Fu-sen. (志賀 慶一) イチゴジャム レシピ(http://15jamrecipe.jimdo.com/) 2016.05.04
const ijfont_1_2 = [
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,
	0xff,0xaa,0xff,0x55,0xff,0xaa,0xff,0x55,
	0x55,0xaa,0x55,0xaa,0x55,0xaa,0x55,0xaa,
	0x00,0x55,0x00,0xaa,0x00,0x55,0x00,0xaa,
	0x99,0x5a,0x3c,0x5a,0x5a,0x24,0x24,0x66,
	0xfb,0xfb,0xfb,0x00,0xdf,0xdf,0xdf,0x00,
	0x24,0x18,0x24,0x24,0x18,0x3c,0x66,0x24,
	0x0a,0x04,0x2a,0x40,0xfe,0x40,0x20,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0xee,0x00,
	0x00,0x04,0x24,0x64,0xfc,0x60,0x20,0x00,
	0xee,0xba,0xee,0x44,0x7c,0x44,0x7c,0x44,
	0x10,0x42,0x00,0x80,0x01,0x00,0x42,0x08,
	0x00,0x7e,0x7e,0x7e,0x7e,0x7e,0x7e,0x00,
	0x00,0x7e,0x42,0x42,0x42,0x42,0x7e,0x00,
	0x00,0x7e,0x5e,0x5e,0x5e,0x42,0x7e,0x00,
	0x00,0x7e,0x7a,0x7a,0x6a,0x42,0x7e,0x00,
	0x00,0x3c,0x24,0x24,0x24,0x24,0x3c,0x00,
	0xc0,0xc0,0xc0,0xc0,0xc0,0xc0,0xc0,0xc0,
	0xff,0xff,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,
	0x00,0x3c,0x3c,0x42,0x42,0x42,0x3c,0x00,
	0x00,0x3c,0x66,0x5e,0x5e,0x66,0x3c,0x00,
	0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,
	0x00,0x00,0xff,0x00,0x00,0xff,0x00,0x00,
	0x03,0x07,0x0e,0x1c,0x38,0x70,0xe0,0xc0,
	0xc0,0xe0,0x70,0x38,0x1c,0x0e,0x07,0x03,
	0x60,0x6c,0x34,0xf0,0x18,0x28,0x4e,0x40,
	0x10,0x20,0x40,0xfe,0x40,0x20,0x10,0x00,
	0x10,0x08,0x04,0xfe,0x04,0x08,0x10,0x00,
	0x10,0x38,0x54,0x92,0x10,0x10,0x10,0x00,
	0x10,0x10,0x10,0x92,0x54,0x38,0x10,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x10,0x10,0x10,0x10,0x10,0x00,0x10,0x00,
	0x50,0x50,0x00,0x00,0x00,0x00,0x00,0x00,
	0x28,0x28,0x7c,0x28,0x7c,0x28,0x28,0x00,
	0x10,0x3c,0x50,0x38,0x14,0x78,0x10,0x00,
	0x60,0x64,0x08,0x10,0x20,0x4c,0x0c,0x00,
	0x20,0x50,0x50,0x20,0x54,0x48,0x34,0x00,
	0x08,0x10,0x20,0x00,0x00,0x00,0x00,0x00,
	0x08,0x10,0x20,0x20,0x20,0x10,0x08,0x00,
	0x20,0x10,0x08,0x08,0x08,0x10,0x20,0x00,
	0x10,0x54,0x38,0x10,0x38,0x54,0x10,0x00,
	0x00,0x10,0x10,0x7c,0x10,0x10,0x00,0x00,
	0x00,0x00,0x00,0x00,0x10,0x10,0x20,0x00,
	0x00,0x00,0x00,0x7c,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x30,0x30,0x00,
	0x00,0x00,0x04,0x08,0x10,0x20,0x40,0x00,
	0x38,0x44,0x4c,0x54,0x64,0x44,0x38,0x00,
	0x10,0x30,0x50,0x10,0x10,0x10,0x7c,0x00,
	0x38,0x44,0x04,0x04,0x18,0x60,0x7c,0x00,
	0x38,0x44,0x04,0x18,0x04,0x44,0x38,0x00,
	0x18,0x28,0x48,0x48,0x48,0x7c,0x08,0x00,
	0x7c,0x40,0x78,0x04,0x04,0x44,0x38,0x00,
	0x38,0x40,0x78,0x44,0x44,0x44,0x38,0x00,
	0x7c,0x44,0x04,0x08,0x08,0x10,0x10,0x00,
	0x38,0x44,0x44,0x38,0x44,0x44,0x38,0x00,
	0x38,0x44,0x44,0x44,0x3c,0x04,0x38,0x00,
	0x00,0x00,0x10,0x00,0x00,0x10,0x00,0x00,
	0x00,0x10,0x00,0x00,0x10,0x10,0x20,0x00,
	0x08,0x10,0x20,0x40,0x20,0x10,0x08,0x00,
	0x00,0x00,0x7c,0x00,0x7c,0x00,0x00,0x00,
	0x20,0x10,0x08,0x04,0x08,0x10,0x20,0x00,
	0x38,0x44,0x44,0x08,0x10,0x00,0x10,0x00,
	0x38,0x44,0x04,0x34,0x54,0x54,0x38,0x00,
	0x38,0x44,0x44,0x44,0x7c,0x44,0x44,0x00,
	0x78,0x24,0x24,0x38,0x24,0x24,0x78,0x00,
	0x38,0x44,0x40,0x40,0x40,0x44,0x38,0x00,
	0x78,0x24,0x24,0x24,0x24,0x24,0x78,0x00,
	0x7c,0x40,0x40,0x7c,0x40,0x40,0x7c,0x00,
	0x7c,0x40,0x40,0x7c,0x40,0x40,0x40,0x00,
	0x38,0x44,0x40,0x40,0x4c,0x44,0x3c,0x00,
	0x44,0x44,0x44,0x7c,0x44,0x44,0x44,0x00,
	0x38,0x10,0x10,0x10,0x10,0x10,0x38,0x00,
	0x1c,0x08,0x08,0x08,0x08,0x48,0x30,0x00,
	0x44,0x48,0x50,0x60,0x50,0x48,0x44,0x00,
	0x40,0x40,0x40,0x40,0x40,0x40,0x7c,0x00,
	0x44,0x6c,0x6c,0x54,0x54,0x54,0x44,0x00,
	0x44,0x64,0x64,0x54,0x4c,0x4c,0x44,0x00,
	0x38,0x44,0x44,0x44,0x44,0x44,0x38,0x00,
	0x78,0x44,0x44,0x44,0x78,0x40,0x40,0x00,
	0x38,0x44,0x44,0x44,0x54,0x48,0x34,0x00,
	0x78,0x44,0x44,0x44,0x78,0x48,0x44,0x00,
	0x38,0x44,0x40,0x38,0x04,0x44,0x38,0x00,
	0x7c,0x10,0x10,0x10,0x10,0x10,0x10,0x00,
	0x44,0x44,0x44,0x44,0x44,0x44,0x38,0x00,
	0x44,0x44,0x28,0x28,0x28,0x10,0x10,0x00,
	0x44,0x44,0x54,0x54,0x54,0x28,0x28,0x00,
	0x44,0x44,0x28,0x10,0x28,0x44,0x44,0x00,
	0x44,0x44,0x28,0x10,0x10,0x10,0x10,0x00,
	0x7c,0x04,0x08,0x10,0x20,0x40,0x7c,0x00,
	0x38,0x20,0x20,0x20,0x20,0x20,0x38,0x00,
	0x00,0x00,0x40,0x20,0x10,0x08,0x04,0x00,
	0x38,0x08,0x08,0x08,0x08,0x08,0x38,0x00,
	0x10,0x28,0x44,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x7c,0x00,
	0x20,0x10,0x08,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x38,0x04,0x3c,0x44,0x3a,0x00,
	0x40,0x40,0x58,0x64,0x44,0x44,0x78,0x00,
	0x00,0x00,0x38,0x44,0x40,0x44,0x38,0x00,
	0x04,0x04,0x34,0x4c,0x44,0x44,0x3c,0x00,
	0x00,0x00,0x38,0x44,0x7c,0x40,0x38,0x00,
	0x18,0x20,0x20,0x7c,0x20,0x20,0x20,0x00,
	0x00,0x00,0x3a,0x44,0x44,0x3c,0x04,0x38,
	0x40,0x40,0x58,0x64,0x44,0x44,0x44,0x00,
	0x10,0x00,0x30,0x10,0x10,0x10,0x10,0x00,
	0x08,0x00,0x18,0x08,0x08,0x08,0x08,0x30,
	0x20,0x20,0x24,0x28,0x30,0x28,0x24,0x00,
	0x30,0x10,0x10,0x10,0x10,0x10,0x18,0x00,
	0x00,0x00,0x78,0x54,0x54,0x54,0x54,0x00,
	0x00,0x00,0x78,0x44,0x44,0x44,0x44,0x00,
	0x00,0x00,0x38,0x44,0x44,0x44,0x38,0x00,
	0x00,0x00,0x38,0x44,0x44,0x78,0x40,0x40,
	0x00,0x00,0x38,0x44,0x44,0x3c,0x04,0x04,
	0x00,0x00,0x58,0x64,0x40,0x40,0x40,0x00,
	0x00,0x00,0x3c,0x40,0x38,0x04,0x78,0x00,
	0x20,0x20,0x7c,0x20,0x20,0x20,0x18,0x00,
	0x00,0x00,0x48,0x48,0x48,0x48,0x34,0x00,
	0x00,0x00,0x44,0x44,0x28,0x28,0x10,0x00,
	0x00,0x00,0x44,0x54,0x54,0x28,0x28,0x00,
	0x00,0x00,0x44,0x28,0x10,0x28,0x44,0x00,
	0x00,0x00,0x44,0x44,0x28,0x28,0x10,0x60,
	0x00,0x00,0x7c,0x08,0x10,0x20,0x7c,0x00,
	0x0c,0x10,0x10,0x20,0x10,0x10,0x0c,0x00,
	0x10,0x10,0x10,0x10,0x10,0x10,0x10,0x00,
	0x60,0x10,0x10,0x08,0x10,0x10,0x60,0x00,
	0x00,0x00,0x20,0x54,0x08,0x00,0x00,0x00,
	0xa0,0x40,0xa8,0x04,0xfe,0x04,0x08,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0xf0,0xf0,0xf0,0xf0,0x00,0x00,0x00,0x00,
	0x0f,0x0f,0x0f,0x0f,0x00,0x00,0x00,0x00,
	0xff,0xff,0xff,0xff,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0xf0,0xf0,0xf0,0xf0,
	0xf0,0xf0,0xf0,0xf0,0xf0,0xf0,0xf0,0xf0,
	0x0f,0x0f,0x0f,0x0f,0xf0,0xf0,0xf0,0xf0,
	0xff,0xff,0xff,0xff,0xf0,0xf0,0xf0,0xf0,
	0x00,0x00,0x00,0x00,0x0f,0x0f,0x0f,0x0f,
	0xf0,0xf0,0xf0,0xf0,0x0f,0x0f,0x0f,0x0f,
	0x0f,0x0f,0x0f,0x0f,0x0f,0x0f,0x0f,0x0f,
	0xff,0xff,0xff,0xff,0x0f,0x0f,0x0f,0x0f,
	0x00,0x00,0x00,0x00,0xff,0xff,0xff,0xff,
	0xf0,0xf0,0xf0,0xf0,0xff,0xff,0xff,0xff,
	0x0f,0x0f,0x0f,0x0f,0xff,0xff,0xff,0xff,
	0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,
	0x00,0x00,0x00,0x18,0x18,0x00,0x00,0x00,
	0x00,0x00,0x00,0xff,0xff,0x00,0x00,0x00,
	0x18,0x18,0x18,0x18,0x18,0x18,0x18,0x18,
	0x18,0x18,0x18,0xff,0xff,0x18,0x18,0x18,
	0x18,0x18,0x18,0xf8,0xf8,0x18,0x18,0x18,
	0x18,0x18,0x18,0x1f,0x1f,0x18,0x18,0x18,
	0x18,0x18,0x18,0xff,0xff,0x00,0x00,0x00,
	0x00,0x00,0x00,0xff,0xff,0x18,0x18,0x18,
	0x00,0x00,0x00,0x0f,0x1f,0x18,0x18,0x18,
	0x00,0x00,0x00,0xf0,0xf8,0x18,0x18,0x18,
	0x18,0x18,0x18,0x1f,0x0f,0x00,0x00,0x00,
	0x18,0x18,0x18,0xf8,0xf0,0x00,0x00,0x00,
	0xff,0xfe,0xfc,0xf8,0xf0,0xe0,0xc0,0x80,
	0xff,0x7f,0x3f,0x1f,0x0f,0x07,0x03,0x01,
	0x80,0xc0,0xe0,0xf0,0xf8,0xfc,0xfe,0xff,
	0x01,0x03,0x07,0x0f,0x1f,0x3f,0x7f,0xff,
	0x44,0x28,0x7c,0x10,0x7c,0x10,0x10,0x00,
	0x00,0x00,0x00,0x00,0x70,0x50,0x70,0x00,
	0x1c,0x10,0x10,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x10,0x10,0x70,0x00,
	0x00,0x00,0x00,0x00,0x40,0x20,0x10,0x00,
	0x00,0x00,0x18,0x18,0x00,0x00,0x00,0x00,
	0x00,0x7e,0x02,0x7e,0x02,0x04,0x18,0x00,
	0x00,0x00,0x00,0x7c,0x14,0x10,0x20,0x00,
	0x00,0x00,0x00,0x0c,0x70,0x10,0x10,0x00,
	0x00,0x00,0x10,0x7c,0x44,0x04,0x18,0x00,
	0x00,0x00,0x00,0x7c,0x10,0x10,0x7c,0x00,
	0x00,0x00,0x08,0x7c,0x18,0x28,0x48,0x00,
	0x00,0x00,0x20,0x7c,0x24,0x20,0x20,0x00,
	0x00,0x00,0x00,0x38,0x08,0x08,0x7c,0x00,
	0x00,0x00,0x3c,0x04,0x3c,0x04,0x3c,0x00,
	0x00,0x00,0x00,0x54,0x54,0x04,0x08,0x00,
	0x00,0x00,0x00,0x7e,0x00,0x00,0x00,0x00,
	0x00,0xfe,0x02,0x14,0x10,0x10,0x60,0x00,
	0x00,0x06,0x18,0x68,0x08,0x08,0x08,0x00,
	0x10,0x7e,0x42,0x02,0x02,0x04,0x18,0x00,
	0x00,0x7c,0x10,0x10,0x10,0x10,0xfe,0x00,
	0x04,0x04,0x7e,0x0c,0x14,0x24,0x44,0x00,
	0x10,0x10,0x7e,0x12,0x12,0x22,0x46,0x00,
	0x10,0x10,0x7e,0x10,0x7e,0x10,0x10,0x00,
	0x00,0x3e,0x22,0x42,0x02,0x04,0x38,0x00,
	0x20,0x20,0x3e,0x44,0x04,0x04,0x38,0x00,
	0x00,0x00,0x7e,0x02,0x02,0x02,0x7e,0x00,
	0x00,0x44,0xfe,0x44,0x44,0x04,0x38,0x00,
	0x00,0x70,0x02,0x72,0x02,0x04,0x78,0x00,
	0x00,0x7e,0x02,0x04,0x08,0x14,0x62,0x00,
	0x00,0x40,0xfe,0x44,0x48,0x40,0x3e,0x00,
	0x00,0x42,0x42,0x24,0x04,0x08,0x10,0x00,
	0x00,0x3e,0x22,0x52,0x0a,0x04,0x38,0x00,
	0x04,0x38,0x08,0xfe,0x08,0x08,0x30,0x00,
	0x00,0x52,0x52,0x52,0x02,0x04,0x18,0x00,
	0x00,0x7c,0x00,0xfe,0x08,0x08,0x70,0x00,
	0x40,0x40,0x40,0x70,0x4c,0x40,0x40,0x00,
	0x00,0x08,0xfe,0x08,0x08,0x08,0x70,0x00,
	0x00,0x00,0x7c,0x00,0x00,0x00,0xfe,0x00,
	0x00,0x7e,0x02,0x34,0x08,0x14,0x62,0x00,
	0x10,0x7e,0x02,0x04,0x18,0x76,0x10,0x00,
	0x00,0x02,0x02,0x02,0x02,0x04,0x78,0x00,
	0x00,0x28,0x28,0x44,0x44,0x82,0x82,0x00,
	0x00,0x40,0x4e,0x70,0x40,0x40,0x3e,0x00,
	0x00,0x7e,0x02,0x02,0x02,0x04,0x38,0x00,
	0x00,0x00,0x20,0x50,0x88,0x04,0x02,0x00,
	0x00,0x10,0xfe,0x10,0x54,0x54,0x92,0x00,
	0x00,0xfe,0x02,0x44,0x28,0x10,0x08,0x00,
	0x00,0x70,0x0e,0x70,0x0e,0x70,0x0e,0x00,
	0x00,0x10,0x10,0x20,0x24,0x42,0xfe,0x00,
	0x00,0x02,0x22,0x14,0x08,0x14,0x62,0x00,
	0x00,0x7c,0x20,0xfe,0x20,0x20,0x1e,0x00,
	0x20,0x20,0xfe,0x22,0x24,0x20,0x20,0x00,
	0x00,0x00,0x3c,0x04,0x04,0x04,0x7e,0x00,
	0x00,0x7c,0x04,0x7c,0x04,0x04,0x7c,0x00,
	0x00,0x7e,0x00,0x7e,0x02,0x04,0x38,0x00,
	0x00,0x44,0x44,0x44,0x04,0x08,0x30,0x00,
	0x00,0x50,0x50,0x50,0x52,0x94,0x98,0x00,
	0x00,0x20,0x20,0x22,0x24,0x28,0x30,0x00,
	0x00,0x7e,0x42,0x42,0x42,0x42,0x7e,0x00,
	0x00,0x7e,0x42,0x02,0x02,0x04,0x38,0x00,
	0x00,0x40,0x22,0x02,0x02,0x04,0x78,0x00,
	0x20,0x90,0x40,0x00,0x00,0x00,0x00,0x00,
	0xe0,0xa0,0xe0,0x00,0x00,0x00,0x00,0x00,
	0x18,0x38,0x78,0xff,0xff,0x78,0x38,0x18,
	0x18,0x1c,0x1e,0xff,0xff,0x1e,0x1c,0x18,
	0x18,0x3c,0x7e,0xff,0xff,0x18,0x18,0x18,
	0x18,0x18,0x18,0xff,0xff,0x7e,0x3c,0x18,
	0x10,0x38,0x7c,0xfe,0xfe,0x38,0x7c,0x00,
	0x00,0x6c,0xfe,0xfe,0x7c,0x38,0x10,0x00,
	0x38,0x38,0xd6,0xfe,0xd6,0x10,0x38,0x00,
	0x10,0x38,0x7c,0xfe,0x7c,0x38,0x10,0x00,
	0x3c,0x66,0xc3,0x81,0x81,0xc3,0x66,0x3c,
	0x3c,0x7e,0xff,0xff,0xff,0xff,0x7e,0x3c,
	0x24,0x6a,0x2a,0x2a,0x2a,0x2a,0x24,0x00,
	0x18,0x24,0x42,0x81,0xbd,0xbd,0xbd,0x7e,
	0x24,0x5a,0x42,0x81,0xa5,0x81,0x42,0x3c,
	0x3c,0x42,0x81,0xa5,0x81,0x7e,0x24,0x66,
	0x0c,0x0a,0x0a,0x08,0x78,0xf8,0x70,0x00,
	0x3c,0x42,0x99,0xa5,0xad,0xa1,0x92,0x4c,
	0x18,0x18,0x24,0x24,0x7e,0xff,0x3c,0x7e,
	0x00,0x18,0x24,0x42,0xff,0x54,0x00,0x00,
	0x10,0x10,0x08,0x08,0x10,0x10,0x08,0x08,
	0x7c,0x10,0x1e,0xb9,0xff,0x9f,0x10,0x7e,
	0x08,0x5a,0x6c,0xfe,0x3c,0x7e,0x4a,0x11,
	0x1c,0x36,0x3a,0x3a,0x3a,0x3e,0x1c,0x00,
	0x00,0x3c,0x42,0x7e,0x5a,0x42,0x7e,0x00,
	0x00,0x06,0x06,0x1e,0x1e,0x7e,0x7e,0x00,
	0x00,0x7c,0x44,0x64,0x64,0x44,0x7c,0x00,
	0x18,0x18,0x3c,0x5a,0x5a,0x3c,0x24,0x66,
	0x00,0x18,0x7e,0x99,0x18,0x3c,0x24,0x66,
	0x00,0x18,0x1a,0x7e,0x50,0x1c,0x14,0x66,
	0x18,0x18,0x10,0x10,0x10,0x10,0x10,0x18,
	0x00,0x18,0x58,0x7e,0x0a,0x18,0x2e,0x62,
	0x18,0x18,0x08,0x08,0x08,0x08,0x08,0x18,
	0x04,0x3e,0x2f,0x56,0x6a,0xd6,0xac,0xf0
];
