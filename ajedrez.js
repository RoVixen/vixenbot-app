const emoji=require("node-emoji");

function TrimUserIdFromMention(eee){
	if (!eee) return;

	if (eee.startsWith('<@') && eee.endsWith('>')) {
		eee = eee.slice(2, -1);

		if (eee.startsWith('!')) {
			eee = eee.slice(1);
		}

		return eee;
	}
}
function IdToMention(id){
	return "<@"+id+">";
}

module.exports={
	Ajedrez:class Ajedrez{
		rawboard="⏺️🅰️🇧🟥🇩🟥🇫🟥🇭\n8️⃣🐙🦐🦑🦞🦀🦑🦐🐙\n7️⃣🍤🍤🍤🍤🍤🍤🍤🍤\n6️⃣⬜⬛⬜⬛⬜⬛⬜⬛\n5️⃣⬛⬜⬛⬜⬛⬜⬛⬜\n4️⃣⬜⬛⬜⬛⬜⬛⬜⬛\n3️⃣⬛⬜⬛⬜⬛⬜⬛⬜\n2️⃣🧂🧂🧂🧂🧂🧂🧂🧂\n1️⃣🏰🐴🤺👸🤴🤺🐴🏰\n⏺️🇦🅱️🇨🟥🇪🟥🇬🟥";
		header="Ajedrez: El levantamiento del rey cangrejo";
		emojis=["🇦","🇧",decodeURI("%F0%9F%87%A8"),"🇩","🇪","🇫","🇬","🇭",
				"1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣",
				"🔄"];
		
		dataBoard=[];
		setWhenCompleteMove=[];
		
		emojidata={
			"bt":"octopus"				 ,
			"bh":"shrimp"                ,
			"bb":"squid"                 ,
			"bq":"lobster"               ,
			"bk":"crab"                  ,
			"bp":"fried_shrimp"          ,
			"wt":"european_castle"       ,
			"wh":"horse"                 ,
			"wb":"fencer"                ,
			"wq":"princess"              ,
			"wk":"prince"                ,
			"wp":"salt"                  ,
			"octopus":"bt"               ,
			"shrimp":"bh"                ,
			"squid":"bb"                 ,
			"lobster":"bq"               ,
			"crab":"bk"                  ,
			"fried_shrimp":"bp"          ,
			"european_castle":"wt"       ,
			"horse":"wh"                 ,
			"fencer":"wb"                ,
			"princess":"wq"              ,
			"prince":"wk"                ,
			"salt":"wp"                  ,
			"sb":"black_large_square"    ,
			"sw":"white_large_square"	 ,
			"black_large_square":"sb"    ,
			"white_large_square":"sw"    ,
			"large_purple_square":"sf"	 ,
			"sf":"large_purple_square"	 ,
			"large_green_square":"st"	 ,
			"st":"large_green_square"
		}
		
		//index 0 from letters input
		//index 1 from numbers input
		moveData={
			f:[-1,-1],
			t:[-1,-1]
		}
		
		constructor(message,player2){
			this.turn=0;//White / w
			this.moveFrom=["-","-"];
			this.moveTo=["-","-"];
			this.selected="";
			
			let MakeDataBoard=(arr)=>{
				this.dataBoard=[];
				
				arr.forEach((line)=>{
					this.dataBoard.push(
						emoji.unemojify(line).split(":").filter(s=>s).slice(1).map((emjName)=>{
							let e=this.EmUnemojify(emjName);
							if(e=="sf")
								return this.selected;
							
							return e;
						})
					);
				});
			};
			
			if(message.constructor.name=="User" && player2.constructor.name=="User"){
				this.playerW=message.id;
				this.playerB=player2.id;
				
				MakeDataBoard(this.rawboard.split("\n").slice(1,9));
			}
			else if(message.constructor.name=="Message"){//&& player2.constructor.name=="Client"){
				let splitted=message.content.split("\n");
				let mdb=splitted.splice(2,8);
				
				let emjArrs=this.GetLetterNumbers();
				
				splitted.forEach((linea)=>{
					let fields=linea.split(":");
					
					
					switch(fields[0]){
						case "Blancas 🤴":
							this.playerW=TrimUserIdFromMention(fields[1]);
						break;
						case "Negras 🦀":
							this.playerB=TrimUserIdFromMention(fields[1]);
						break;
						case "Turno de":
							this.turn=(["🤴","🦀"]).findIndex(t=>t==fields[1]);
						break;
						case "Desde":
							this.moveFrom=[fields[1],fields[2]];
							
							this.moveData.f[0]=emjArrs.letters.findIndex(e=>e==fields[1]);
							this.moveData.f[1]=emjArrs.numbers.findIndex(e=>e==fields[2]);
						break;
						case "Hasta":
							this.moveTo=[fields[1],fields[2]];
							
							this.moveData.t[0]=emjArrs.letters.findIndex(e=>e==fields[1]);
							this.moveData.t[1]=emjArrs.numbers.findIndex(e=>e==fields[2]);
						break;
						case "Seleccionado":
							this.selected=this.EmUnemojify(emoji.which(fields[1]));
						break;
					}
				});
				
				MakeDataBoard(mdb);
			}
			else throw "wrong constructor parameters, must be (Message) or (User,User)";
		}
		
		BuildCurrentGameText=function(){
			
			return this.header+"\n"+
				this.BuildCurretBoard()+"\n"+
				"Blancas 🤴:"+IdToMention(this.playerW)+"\n"+
				"Negras 🦀:"+IdToMention(this.playerB)+"\n"+
				"Turno de:"+((["🤴","🦀"])[this.turn])+"\n"+
				"Desde:"+this.moveFrom.join(":")+"\n"+
				"Hasta:"+this.moveTo.join(":")+"\n"+
				(this.selected!=""?"Seleccionado:"+emoji.get(this.EmUnemojify(this.selected))+"\n":"")+
				(this.gameMes?"Mensaje: "+this.gameMes:"");
		}
		
		BuildCurretBoard=function(f=null,to=null,board=null){
			if(!f)
				f=this.moveData.f;
			if(!to)
				to=this.moveData.t;
			if(!board)
				board=this.dataBoard;
			
			let t="⏺️🅰️🇧🟥🇩🟥🇫🟥🇭\n";
			
			board.forEach((linea,index)=>{
				//if selecting from but havent selected a letter yet
				if(f[0]==-1 && f[1]==(index))
					t+="🟪";
				else if(to[0]==-1 && to[1]==(index))
					t+="🟩";
				else
					t+=(8-index)+"️⃣";
				
				linea.forEach((data,index2)=>{
					if(f[0]==(index2) && f[1]==(index))
						t+="🟪";
					else if(to[0]==(index2) && to[1]==(index))
						t+="🟩";
					else{
						t+=emoji.get(this.EmUnemojify(data));
					}
						
				});
				t+="\n";
			});
			//🟪 morado
			//🟩 verde
			
			let x=["🇦","🅱️","🇨","🟥","🇪","🟥","🇬","🟥"];
			
			//if selecting from but havent selected a number yet
			if(this.moveData.f[0]!=-1 && this.moveData.f[1]==-1)
				x[this.moveData.f[0]]="🟪";
			
			if(this.moveData.t[0]!=-1 && this.moveData.t[1]==-1)
				x[this.moveData.t[0]]="🟩";
			
			t+="⏺️"+x.join("");
			
			return t;
		}
		
		Input=function(emoji,user){
			this.SetGameMessage("");
			
			if(typeof user == "object")
				if(user.constructor.name=="User")
					user=user.id;
			
			if(user!=this.playerB && user!=this.playerW)
				return this.SetGameMessage("No eres parte de el juego "+IdToMention(user));
			
			if(user!=this.GetTurnUser())
				return this.SetGameMessage("No es tu turno "+IdToMention(user));
			
			if(this.MoveInput(emoji)){ //Move input has been completed
				let playerTurnChar=this.GetTurnUserText();
				
				if(this.IsMovePossible(
					this.dataBoard,
					playerTurnChar,
					this.selected,
					this.moveData.f,
					this.moveData.t
				)){
					this.CompleteActualMove();
					this.SwitchTurns();
				}
				
				this.ResetMoveData();
			}
		}
		
		MoveInput=function(emj){
			if(emj=="🔄"){
				this.ResetMoveData();
				return false;
			}
			
			let emjArrs=this.GetLetterNumbers();
			
			let setFromTo=(arr)=>{
				let a=emjArrs.letters.findIndex(e=>e==emj);
				let b=emjArrs.numbers.findIndex(e=>e==emj);
				
				if(a!=-1)
					arr[0]=a;
				else if(b!=-1)
					arr[1]=b;
				
				return arr;
			};
			
			if(this.moveData.f[0]==-1 || this.moveData.f[1]==-1)
				this.moveData.f=setFromTo(this.moveData.f);
			else if(this.moveData.t[0]==-1 || this.moveData.t[1]==-1)
				this.moveData.t=setFromTo(this.moveData.t);
			
			if(this.moveData.f[0]!=-1 && this.moveData.f[1]!=-1 && this.selected=="")
				this.selected=this.CheckIfCanSelect(this.moveData.f);//this.moveData.f[1],this.moveData.f[0]);
			
			this.moveFrom=[emjArrs.letters[this.moveData.f[0]]||"-",emjArrs.numbers[this.moveData.f[1]]||"-"];
			this.moveTo=  [emjArrs.letters[this.moveData.t[0]]||"-",emjArrs.numbers[this.moveData.t[1]]||"-"];
			
			return (
				this.moveData.f[0]!=-1 && 
				this.moveData.f[1]!=-1 &&
				this.moveData.t[0]!=-1 && 
				this.moveData.t[1]!=-1
			);
		}
		
		CheckIfCanSelect=function(coords){
			let selected=this.GetPieceFromDataBoard(coords);//this.dataBoard[x][y];
			
			/*debug*///(this.dataBoard[0][7]);
			
			if(selected.startsWith("s")){
				this.SetGameMessage("Este es un espacio vacio");
				this.ResetMoveData();
				return "";
			}
			let playerTurnChar=this.GetTurnUserText();
			
			if(!selected.startsWith(playerTurnChar)){
				this.SetGameMessage("Esta no es tu pieza");
				this.ResetMoveData();
				return "";
			}
			
			return selected;
		}
		
		ResetMoveData=function(){
			this.moveData={
				f:[-1,-1],
				t:[-1,-1]
			};
			this.moveFrom=["-","-"];
			this.moveTo=["-","-"];
			this.selected="";
			this.ClearSpecialMoves();
		}
		
		IsMovePossible=function(board,player,selected,fron,to,setGameMes=true){
			//reference break
			board=board.slice();
			fron=fron.slice();
			to=to.slice();
			
			let selSpl=selected.split("");
			let destPiece=this.GetPieceFromDataBoard(to,board);
			if(selSpl[0]!=player){
				if(setGameMes)
					this.SetGameMessage("Esta no es la pieza de "+(player=="w"?"Blancas":"Negras"));
				return false;
			}
			
			if(destPiece.split("")[0]==player){
				if(setGameMes)
					this.SetGameMessage("Esta posicion ya esta ocupada por una de tus piezas");
				return false;
			}
			
			if(fron===to){
				if(setGameMes)
					this.SetGameMessage("Esta posicion es la misma wtf?");
				return false;
			}
			
			let toRet=this.IsMovePiece(fron,to,board,setGameMes,true);
			
			if(!toRet && setGameMes)
				this.SetGameMessage("Este movimiento es ilegal");
			
			if(toRet){
				let checkingBoard=JSON.parse(JSON.stringify(board));
				this.CompleteActualMove(fron,to,checkingBoard);
				
				let playerKingPos=this.GetPiecesCoords((player=="w"?"w":"b")+"k",checkingBoard)[0];
				
				let oponentPieces=this.GetPlayerAviablePieces((player=="w"?"b":"w"),checkingBoard);//opponent pieces
				let cp;
				let isInCheck=oponentPieces.some((opPiece)=>{
					let r=this.IsMovePiece(opPiece.coords,playerKingPos,checkingBoard);
					if(r)
						cp=opPiece;
					return r;
				});
				
				if(isInCheck){
					if(setGameMes)
						this.SetGameMessage("No puedes, estarias en jaque por "+emoji.get(this.EmUnemojify(cp.piece))+"");
					toRet=false;
				}
			}
			
			return toRet;
		}
		
		
		//Pieces move checks{
		IsMovePiece=function(f,t,board=null,setGameMes=false,executeSpecialMove=false){
			if(!board)
				board=this.dataBoard;
			f=f.slice();
			t=t.slice();
			
			let piece=this.GetPieceFromDataBoard(f,board);
			
			let toRet=false;
			switch(piece[1]){
				default:
					if(setGameMes)
						this.SetGameMessage("Esta no es una pieza valida");
					toRet= false;
				break;
				case "h":
					toRet= this.IsMoveHorse(f,t,board);
				break;
				case "t":
					toRet= this.IsMoveTower(f,t,board);
				break;
				case "q":
					toRet= this.IsMoveQueen(f,t,board);
				break;
				case "b":
					toRet= this.IsMoveBishop(f,t,board);
				break;
				case "p":
					toRet= this.IsMovePawn(f,t,board,executeSpecialMove);
				break;
				case "k":
					toRet= this.IsMoveKing(f,t,board,executeSpecialMove);
				break;
			
			}
			
			return toRet;
		}
		
		GetPiecesInLine=function(f,t,board=null){
			//reference break
			if(!board)
				board=this.dataBoard;
			f=f.slice();
			t=t.slice();
			board=board.slice();
			
			let d=[t[0]-f[0],t[1]-f[1]];
			if(//d[0]!=0 && d[1]!=0 && (Math.abs(d[0])!=Math.abs(d[1])))
				!((Math.abs(d[0])==Math.abs(d[1]))||
				(d[0]!=0 && d[1]==0) ||
				(d[1]!=0 && d[0]==0))
			)
				throw console.trace("from-to input no valid, must be a horizontal,vertical or diagonal line\n\n");
			
			
			let toRet=[];
			var toGet=f;
			//horizontal/vertical line
			if(d[0]==0 || d[1]==0){
				let coord=(d[0]==0?1:0);
				let dist=Math.abs(d[coord]);
				let dir=Math.round(d[coord]/dist);
				
				for(let i=0;i<=dist;i++){
					toRet.push(this.GetPieceFromDataBoard(toGet,board));
					toGet[coord]+=dir;
				}
			}//diagonal line
			else{
				let dist=Math.abs(d[0]);
				let dir=[d[0]/dist,d[1]/dist];
				
				for(let i=0;i<=dist;i++){
					
					toRet.push(this.GetPieceFromDataBoard(toGet,board));
					
					/*
						Aqui sucede el error mas extraño que jamas habia visto,
					al parecer afectar esta variable "toGet" afecta directamente
					a this.moveData.f
					
						Es cierto que esta variable proviene de este valor, pero esta es una
					nueva variable creada en memoria (o eso me gustaria creer), que recibe
					un valor de un parametro pasado a esta funcion (hablo de f), esta funcion 
					es usada en la funcion de validacion de el movimiento de la torre "IsMoveTower",
					dond, porsupuesto, se pasa como primer valor this.moveData.f, por lo que f toma
					el valor de this.moveData.f, pero en javascript no existen referencias a variables
					y el vinculo se perdio hace 2 pasos, asi que.... tengo que hacer lo que se
					ve en la septima linea despues de esta que estas leyendo
					*/
					toGet[0]+=dir[0];
					toGet[1]+=dir[1];
				}
			}
			/*
				Efectivamente, ya que modificar una variable que NADA tiene que ver con las
			variables de clase afecta directamente a this.moveData.f , una variable de clase,
			tengo que reestablecerla a su valor original y gracias a dios por alguna razon decidi
			guardar esta informacion basura this.moveFrom, que ahora tiene una utilidad concreta...
			reparar lo que hace este bug regresando a this.moveData.f a su valor original
			*/
			
			/*
				al final el problema era precisamente que no sabia que la referencia a variables
			funciona diferente en javascript (its not a bug, its a feature)
			*/
			
			return toRet;
		}
		
		IsReachAndEat=function(f,t,p,board=null){
			if(!board)
				board=this.dataBoard;
			f=f.slice();
			t=t.slice();
			
			if(p!="w" && p!="b")
				throw console.trace("third parameter p must be literal string \"b\" or \"w\"");
			
			let line=this.GetPiecesInLine(f,t,board);
			
			return line[0][0]==p&&line.slice(1,-1).every((piece)=>piece[0]=="s")&&line.pop()[0]!=p;
		}
		
		IsMoveHorse=function(f,t){
			let d=[Math.abs(t[0]-f[0]),Math.abs(t[1]-f[1])];
			if(
				(d[1]==1 && d[0]==2)||
				(d[1]==2 && d[0]==1)
			)
				return true;
			
			return false;
		}
		
		IsMoveTower=function(f,t,board=null){
			if(!board)
				board=this.dataBoard;
			f=f.slice();
			t=t.slice();
			
			if(f[0]!=t[0] && f[1]!=t[1])
				return false;
			
			let line=this.GetPiecesInLine(f,t);
			
			return this.IsReachAndEat(f,t,this.GetPieceFromDataBoard(f,board)[0],board);
		}
		
		IsMoveQueen=function(f,t,board=null){
			if(!board)
				board=this.dataBoard;
			f=f.slice();
			t=t.slice();
			
			let d=[t[0]-f[0],t[1]-f[1]];
			
			if(
				!((Math.abs(d[0])==Math.abs(d[1]))||
				(d[0]!=0 && d[1]==0) ||
				(d[1]!=0 && d[0]==0))
			)
				return false;
			
			return this.IsReachAndEat(f,t,this.GetPieceFromDataBoard(f,board)[0],board);
		}
		
		IsMoveBishop=function(f,t,board=null){
			if(!board)
				board=this.dataBoard;
			f=f.slice();
			t=t.slice();
			
			let d=[t[0]-f[0],t[1]-f[1]];
			
			if(Math.abs(d[0])!=Math.abs(d[1]))
				return false;
			
			return this.IsReachAndEat(f,t,this.GetPieceFromDataBoard(f,board)[0],board);
		}
		
		IsMoveKing=function(f,t,board=null,executeSpecialMove=false){
			if(!board)
				board=this.dataBoard;
			f=f.slice();
			t=t.slice();
			
			let king=this.GetPieceFromDataBoard(f,board);
			
			let d=[t[0]-f[0],t[1]-f[1]];
			
			if(executeSpecialMove){
				let ymust=(king[0]=="w"?7:0);
				if(f[0]==4 && f[1]==ymust && t[1]==ymust){
					let a=null;
					let b=null;
					
					if(t[0]==1){
						a=0;
						b=1;
					}
					else if(t[0]==6){
						a=7;
						b=-1;
					}
					
					if(a!==null&&b!==null){
						let nt=[a,ymust];
						let mustTower=this.GetPieceFromDataBoard(nt,board);
						let line=this.GetPiecesInLine(f,nt,board);
						console.log(t,nt,[t[0]-1,ymust]);
						if(line.slice(1,-1).every(mid=>mid[0]=="s") &&
							mustTower[0]==king[0] && mustTower[1]=="t"
						){
							this.setWhenCompleteMove=[{
								coords:[t[0]+b,ymust],
								piece:king[0]+"t"
							},{
								coords:nt,
								piece:this.GetSquareFromCoords(nt)
							}];
							return true;
						}
					}
				}
			}
			
			if(!(Math.abs(d[0])<=1 && Math.abs(d[1])<=1))
				return false;
			
			return this.IsReachAndEat(f,t,king[0],board);
		}
		
		IsMovePawn=function(f,t,board=null,executeSpecialMove=false){
			if(!board)
				board=this.dataBoard;
			f=f.slice();
			t=t.slice();
			
			let pawn=this.GetPieceFromDataBoard(f,board);
			
			if(pawn!="wp" && pawn!="bp")
				return false;
			
			let o=(pawn[0]=="b"?"w":"b");
			
			
			let mdir=(pawn[0]=="w"?-1:1);
			let d=[t[0]-f[0],t[1]-f[1]];
			
			if(!(//1 solo paso
				(d[0]==0 && d[1]==mdir) ||
				//doble paso al comenzar
				(d[0]==0 && d[1]==mdir*2 && f[1]==(pawn[0]=="w"?6:1) && 
				this.GetPieceFromDataBoard(t,board)[0]=="s" && this.GetPieceFromDataBoard([t[0],t[1]-mdir],board)[0]=="s")||
				//comer en 1 paso diagonal
				(Math.abs(d[0])==1 && d[1]==mdir && this.GetPieceFromDataBoard(t,board)[0]==o)
			))
				return false;
			
			if(executeSpecialMove){
				if(t[1]==(pawn[0]=="w"?0:7)){
					this.setWhenCompleteMove=[{
						piece:pawn[0]+"q",
						coords:t
					}];
				}
			}
			
			return true;
		}
		
		//}Pieces move checks
		
		CompleteActualMove=function(f=null,t=null,board=null){
			if(!f)
				f=this.moveData.f;
			if(!t)
				t=this.moveData.t;
			if(board?.constructor.name!="Array")
				board=this.dataBoard;
			
			let p=this.GetPieceFromDataBoard(f,board);
			this.SetPieceIntoDataBoard(t,p,board);
			this.SetPieceIntoDataBoard(f,this.GetSquareFromCoords(f),board);
			
			if(this.setWhenCompleteMove.length>0){
				this.setWhenCompleteMove.forEach(sm=>{
					this.SetPieceIntoDataBoard(sm.coords,sm.piece,board);
				});
			}
		}
		
		SetPieceIntoDataBoard=function(coords,piece,board=null){
			if(!board)
				board=this.dataBoard;
			
			if(typeof this.EmUnemojify(piece)!="string")
				throw console.trace("SetPieceIntoDataBoard: piece doesnt exist");
			
			board[coords[1]][coords[0]]=piece;
		}
		
		GetPieceFromDataBoard=function(coords,board=null){
			if(board?.constructor.name!="Array")
				board=this.dataBoard;
			
			let m=board[coords[1]][coords[0]];//es m de mierda sucia que me esta agarrando el === como asignacion esta mierda loca rara
			//enrealidad no lo estaba haciendo, el error estaba en otro lado, la manera especial
			//que tiene javascript de referenciar variables me jodio bien gracioso
			if("sf"==m)
				return this.selected;//this.dataBoard[coords[1]][coords[0]];
			
			return m;
		}
		
		GetPlayerAviablePieces=function(player,board=null){
			if(!board)
				board=this.dataBoard;
			
			if(!player=="w" && !player=="b")
				throw console.trace("first parameter player must be literal string \"w\" or \"b\"");
			
			let pieces=[];
			board.forEach((row,x)=>{
				row.forEach((piece,y)=>{
					if(piece[0]==player){
						pieces.push({
							coords:[y,x],
							piece
						});
					}
				});
			});
			
			return pieces;
		}
		
		GetPiecesCoords=function(pieces,board=null){
			if(!board)
				board=this.dataBoard;
			if(typeof pieces == "string")
				pieces=[pieces];
			
			let coords=[];
			board.forEach((row,x)=>{
				row.forEach((piece,y)=>{
					if(pieces.find(p=>p==piece)){
						coords.push([y,x]);
					}
				});
			});
			
			return coords;
		}
		
		ExecuteSpecialMoves=function(){
			this.specialMoves.forEach(data=>{
				switch(data.move){
					case "castling":
						data.details.kingPos
						
					break;
				}
			});
		}
		
		ClearSpecialMoves=function(){
			this.setWhenCompleteMove=[];
		}
		
		GetLetterNumbers=function(){
			return {
				letters:this.emojis.slice(0,8),
				numbers:this.emojis.slice(8,16).reverse()
			} 
		}
		
		SetGameMessage=function(message){
			this.gameMes=message;
		}
		
		GetEmogisForInputs=function(){
			return this.emojis;
		}
		
		GetSquareFromCoords=function(coords){
			let a=(coords[0]%2==0);
			if((coords[1]%2!=0))
				a=!a;
			
			return (a?"sw":"sb");
			
		}
		
		EmUnemojify=function(emojiname){
			return this.emojidata[emojiname];
		}
		
		GetTurnUser=function(){
			let toRet=([this.playerW,this.playerB])[this.turn];
			
			if(!toRet)
				throw "the turn is "+this.turn;
			
			return toRet;
		}
		
		GetTurnUserText=function(){
			let toRet=(["w","b"])[this.turn];
			
			if(!toRet)
				throw "the turn is "+this.turn;
			
			return toRet;
		}
		
		GetNonTurnUserText=function(){
			let toRet=(["b","w"])[this.turn];
			
			if(!toRet)
				throw console.trace("the turn is "+this.turn);
			
			return toRet;
		}
		
		SetTurnUser=function(user){
			if(typeof user == "object")
				if(user.constructor.name=="User")
					user=user.id;
			
			this.turn=([this.playerW,this.playerB]).findIndex(p=>p==user);
			
			if(this.turn==-1)
				throw "user "+user.toString()+" is not an actual player";
		}
		
		SwitchTurns=function(){
			this.turn=1-this.turn;
		}
	}
}
