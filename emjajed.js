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
βΊοΈπ°οΈπ§π₯π©π₯π«π₯π­
8οΈβ£πβ¬β¬β¬π¦β¬β¬π
7οΈβ£π€π€π€β¬π€π€β¬β¬
6οΈβ£β¬β¬β¬β¬π€β¬β¬β¬
5οΈβ£β¬β¬β¬β¬β¬β¬β¬β¬
4οΈβ£β¬β¬β¬β¬π§β¬β¬β¬
3οΈβ£β¬β¬β¬β¬β¬β¬β¬β¬
2οΈβ£π§β¬β¬π§β¬π§π§π§
1οΈβ£π°β¬β¬β¬π€΄β¬β¬π°
βΊοΈπ¦π±οΈπ¨π₯πͺπ₯π¬π₯
Blancas π€΄:<@459197631533678623>
Negras π¦:<@459197631533678623>
Turno de:π€΄
Desde:-:-
Hasta:-:-`
	/*
`Ajedrez: El levantamiento del rey cangrejo
βΊοΈπ°οΈπ§π₯π©π₯π«π₯π­
8οΈβ£ππ¦π¦π¦π¦π¦π¦π
7οΈβ£π€π€π€π€π€π€π€π€
6οΈβ£β¬β¬β¬β¬β¬β¬β¬β¬
5οΈβ£β¬β¬β¬β¬β¬β¬β¬β¬
4οΈβ£β¬β¬β¬β¬β¬β¬β¬β¬
3οΈβ£β¬β¬β¬β¬β¬β¬β¬β¬
2οΈβ£π§π§π§π§π§π§π§π§
1οΈβ£π°π΄π€ΊπΈπ€΄π€Ίπ΄π°
βΊοΈπ¦π±οΈπ¨π₯πͺπ₯π¬π₯
Blancas π€΄:<@459197631533678623>
Negras π¦:<@459197631533678623>
Turno de:π€΄
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
	a:`π¦`,
	b:`π§`,
	c:`π¨`,
	d:`π©`,
	e:`πͺ`,
	f:`π«`,
	g:`π¬`,
	h:`π­`
}

const n=[
	null,
	`1οΈβ£`,
	`2οΈβ£`,
	`3οΈβ£`,
	`4οΈβ£`,
	`5οΈβ£`,
	`6οΈβ£`,
	`7οΈβ£`,
	`8οΈβ£`
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