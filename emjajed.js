/*
node emjajed.js
*/
const emoji=require("node-emoji");
const {Ajedrez}=require("./ajedrez.js");

const message={
	constructor:{
		name:"Message"
	},
	content:
`Ajedrez: El levantamiento del rey cangrejo
⏺️🅰️🇧🟥🇩🟥🇫🟥🇭
8️⃣🐙⬜⬛⬜🦀⬜⬛🐙
7️⃣🍤🍤🍤⬛🍤🍤⬜⬛
6️⃣⬛⬜⬛⬜🍤⬜⬛⬜
5️⃣⬜⬛⬜⬛⬜⬛⬜⬛
4️⃣⬛⬜⬛⬜🧂⬜⬛⬜
3️⃣⬜⬛⬜⬛⬜⬛⬜⬛
2️⃣🧂⬜⬛🧂⬛🧂🧂🧂
1️⃣🏰⬛⬜⬛🤴⬛⬜🏰
⏺️🇦🅱️🇨🟥🇪🟥🇬🟥
Blancas 🤴:<@459197631533678623>
Negras 🦀:<@459197631533678623>
Turno de:🤴
Desde:-:-
Hasta:-:-`
	/*
`Ajedrez: El levantamiento del rey cangrejo
⏺️🅰️🇧🟥🇩🟥🇫🟥🇭
8️⃣🐙🦐🦑🦞🦀🦑🦐🐙
7️⃣🍤🍤🍤🍤🍤🍤🍤🍤
6️⃣⬛⬜⬛⬜⬛⬜⬛⬜
5️⃣⬜⬛⬜⬛⬜⬛⬜⬛
4️⃣⬛⬜⬛⬜⬛⬜⬛⬜
3️⃣⬜⬛⬜⬛⬜⬛⬜⬛
2️⃣🧂🧂🧂🧂🧂🧂🧂🧂
1️⃣🏰🐴🤺👸🤴🤺🐴🏰
⏺️🇦🅱️🇨🟥🇪🟥🇬🟥
Blancas 🤴:<@459197631533678623>
Negras 🦀:<@459197631533678623>
Turno de:🤴
Desde:-:-
Hasta:-:-`
*/
};

const user={
	constructor:{
		name:"User"
	},
	id:"459197631533678623",
	toString:()=>"<@459197631533678623>"
};

const l={
	a:`🇦`,
	b:`🇧`,
	c:`🇨`,
	d:`🇩`,
	e:`🇪`,
	f:`🇫`,
	g:`🇬`,
	h:`🇭`
}

const n=[
	null,
	`1️⃣`,
	`2️⃣`,
	`3️⃣`,
	`4️⃣`,
	`5️⃣`,
	`6️⃣`,
	`7️⃣`,
	`8️⃣`
];

var test=new Ajedrez(message);
function testInput(f,t){
	test.Input(f[0],user);
	test.Input(f[1],user);
	if(test.gameMes)
		return;
	test.Input(t[0],user);
	test.Input(t[1],user);
}

function playNLog(f,t){
	console.log("\n");
	testInput(f,t);
	console.log("Game Message: "+test.gameMes);
}

console.clear();

let a=
[ 2, 6 ]
;
/*
console.log(test.GetPieceFromDataBoard(a));
console.log(test.GetPlayerAviablePieces(test.GetPieceFromDataBoard(a)[0]));
*/

playNLog([l.e,n[1]],[l.g,n[1]]);
playNLog([l.e,n[8]],[l.b,n[8]]);

/*
*/


//movimiento de la torre, da bugs


console.log("\n");
console.log(test.BuildCurrentGameText());