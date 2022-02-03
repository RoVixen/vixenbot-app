const emoji=require("node-emoji");

function TrimUserIdFromMention(mention){
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return mention;
	}
}

function IdToMention(id){
	return "<@"+id+">";
}

module.exports={
	TresEnLineaHandler:class TresEnLineaHandler{
		emptyTableroString="↖️⬆️↗️\n⬅️⏺️➡️\n↙️⬇️↘️";
		header="type:tablero_3enL";
		
		constructor(texto,playerx,playero){
			if(typeof texto!="string" || texto=="")
				texto=this.header+"\n"+this.emptyTableroString;//"\n↖️⬆️↗️\n⬅️⏺️➡️\n↙️⬇️↘️";
			
			let splitted=texto.split("\n");
			if(splitted[0]==this.header)
				splitted.shift();
			this.tableroRaw=[splitted[0],splitted[1],splitted[2]].join("\n");
			this.tableroData=this.RawToData(this.tableroRaw);
			
			splitted.slice(3);
			//now the values
			this.turnode="x";
			this.playero=TrimUserIdFromMention(playero);
			this.playerx=TrimUserIdFromMention(playerx);
			
			splitted.forEach((line)=>{
				let linesp=line.split(":");
				switch(linesp[0]){
					case "Turno de":
						this.turnode=emoji.which(linesp[1]);
					break;
					case "Ganador":
						this.ganador=emoji.which(linesp[1]);
					break;
					case "Empate":
						this.ganador="e";
					break;
					case emoji.get("x"):
						this.playerx=TrimUserIdFromMention(linesp[1].trim());
					break;
					case emoji.get("o"):
						this.playero=TrimUserIdFromMention(linesp[1].trim());
					break;
				}
			});
			
			console.log(this);
		}
		
		RawToData(rawText){
			let rt=rawText.split("\n");
			let data=[];
			rt.forEach(linea=>{
				data.push(emoji.unemojify(linea).split(":").filter(a=>(a!="")));
			});
			
			return data;
		}
		
		BuildCurrentGameText(){
			let t=this.header+"\n";
			this.tableroData.forEach((linea)=>{
				t+=emoji.emojify(linea.map(val=>":"+val+":").join(""))+"\n";
			});
			
			
			if(this.ganador){
				if(this.ganador=="e")
					t+="Empate, nadie gana\n";
				else
					t+="Ganador:"+emoji.get(this.ganador)+"\n";
			}
			else if(this.turnode)
				t+="Turno de:"+emoji.get(this.turnode)+"\n";
			
			if(this.playerx)
				t+=emoji.get("x")+":"+IdToMention(this.playerx)+"\n";
			if(this.playero)
				t+=emoji.get("o")+":"+IdToMention(this.playero)+"\n";
			
			if(this.mensaje)
				t+="Mensaje:"+this.mensaje+"\n";
			
			return t;
		}
		
		PlayMove(emojiClicked,user){
			if(this.ganador)
				return;
			
			user=TrimUserIdFromMention(user);
			
			if(user!=this.playero && user!=this.playerx){
				console.log(user);
				this.mensaje=IdToMention(user)+", No eres parte de la partida";
				return;
			}
			
			if(user!=this.GetPlayerInTurno()){
				console.log(user);
				this.mensaje="No es tu turno "+IdToMention(user);
				return;
			}
			
			let e=emoji.find(emojiClicked).key;
			
			this.tableroData=this.tableroData.map((linea)=>{
				return linea.map(cha=>{
					if(cha==e){
						let toret=this.turnode;
						this.SwitchTurns();
						return toret;
					}
					return cha;
				});
			});
			
			if(this.CheckWinner()){
				//console.log(this.ganador);
			}
		}
		
		SwitchTurns(){
			this.turnode=(this.turnode=="o"?"x":"o");
		}
		
		GetPlayerInTurno(){
			return (this.turnode=="x"?this.playerx:this.playero);
		}
		
		GetEmogisForInputs(){
			let a=this.RawToData(this.emptyTableroString);
			let b=[];
			a.forEach(linea=>{
				linea.forEach(cha=>{
					b.push(emoji.get(cha));
				});
			});
			
			return b;
		}
		
		CheckWinner(){
			//=undefined;
			let allthesame=(arr)=>{
				//console.log(arr);
				
				if(arr.length!=3)return false;
				return (arr[0]==arr[1] && arr[1]==arr[2]);
			}
			
			let winnerFound=(arr)=>{
				this.ganador=arr[0];
			}
			
			let oxcount=0;
			for(let i=0;i<3;i++){
				if(allthesame(this.tableroData[i]))
					winnerFound(this.tableroData[i]);
				
				let a=[this.tableroData[0][i],this.tableroData[1][i],this.tableroData[2][i]];
				if(allthesame(a))
					winnerFound(a);
				
				a.forEach((val)=>{
					if(val=="o"||val=="x")
						oxcount++;
				});
			}
			
			let b=[this.tableroData[0][0],this.tableroData[1][1],this.tableroData[2][2]];
			if(allthesame(b))
				winnerFound(b);
			
			let c=[this.tableroData[0][2],this.tableroData[1][1],this.tableroData[2][0]];
			if(allthesame(c))
				winnerFound(c);
			
			if(oxcount==9 && !this.ganador)
				this.ganador="e";
			
			return this.ganador||false;
		}
	}
}