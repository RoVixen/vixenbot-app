const {TresEnLineaHandler} = require("./tresenlinea.js");
const {Ajedrez} = require("./ajedrez.js");
const emoji=require("node-emoji");

module.exports={
	reactionHandler:{
		type:{
			tablero_3enL:{
				f:(messageReaction,user,client)=>{
					
					let actualJuego=new TresEnLineaHandler(messageReaction.message.content);
					actualJuego.PlayMove(messageReaction.emoji.name,user.toString());
					
					//console.log(actualJuego.playero+"=="+"<@&"+client.user.toString().slice(2));
					if(actualJuego.playero.substr(2,1)=="&"){
						let movesLeft=[];
						actualJuego.tableroData.forEach(linea=>{
							linea.forEach(cha=>{
								if(cha!="x" && cha!="o")
									movesLeft.push(emoji.get(cha));
							});
						});
						
						actualJuego.PlayMove(
							movesLeft[Math.floor(Math.random()*movesLeft.length)],
							actualJuego.playero
						);
					}
					
					messageReaction.message.edit(actualJuego.BuildCurrentGameText());
				}
			}
		},
		"{{burrito":{
			f:(messageReaction,user,client)=>{
				console.log(emoji.which(messageReaction.emoji.name));
				console.log(messageReaction.emoji.name);
				
				if(messageReaction.emoji.name==emoji.get("taco"))
					true;//messageReaction.remove();
				else
					messageReaction.message.react(emoji.get("taco"));
			}
		},
		"Ajedrez: El levantamiento del rey cangrejo":{
			f:(messageReaction,user,client)=>{
				
				let actualJuego=new Ajedrez(messageReaction.message,client);
				
				actualJuego.Input(messageReaction.emoji.name,user);
				messageReaction.message.edit(actualJuego.BuildCurrentGameText());
			}
		},
		"F":{
			f:(messageReaction,user,client)=>{
				if(messageReaction.emoji.name=="🇫"){
					const efes=["🇫","f","F","𝔣","𝖋","ⓕ","🅕","𝚏","𝕗","𝒻","🅵","🄵","𝐟","𝒇","𝗳","𝙛"];
					
					messageReaction.message.edit(efes[Math.ceil(Math.random()*efes.length)-1]);
				}
			}
		},
		"checnado el nonce de este mensaje":{
			f:(messageReaction,user,client)=>{
				
				console.log(messageReaction.message.nonce);
			}
		}
	}
}