const {TresEnLineaHandler} = require("./tresenlinea.js");
const {Ajedrez} = require("./ajedrez.js");

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

module.exports={
	chatCommands:{
		revertir:{
			f:(params,message)=>{
				message.reply(params.join(" ").split("").reverse().join(""))
					.then(console.log)
					.catch(console.error);
			},
			desc:"reescribe un texto en reversa"
		},
		burrito:{
			f:(params,message)=>{
				message.react("🌯")
					.then(console.log)
					.catch(console.error);
			},
			desc:"burrito"
		},
		tresenlinea:{
			desc:"dispone de un tablero de 3 en linea totalmente funcional\n>      Parametros: @Oponente",
			f:(params,message)=>{
				let t="";
				if(params[0] && /\u003c\u0040.{0,1}\d+\u003e/.test(params[0]))
					t=new TresEnLineaHandler("",
						message.author.toString(),
						params[0].trim()
					);
				else{
					message.reply("Debes escribir un oponente valido, Ejemplo: {{tresenlinea @Alguien ");
					return;
				}
				
				message.channel.send(t.BuildCurrentGameText())
				.then(tableroMes=>{
					//let a=["↖️","⬆️","↗️","⬅️","⏺️","➡️","↙️","⬇️","↘️"];
					t.GetEmogisForInputs().forEach(emoj=>{
						tableroMes.react(emoj);
					});
				});
			}
		},
		yo:{
			desc:"te responde con un mensaje conteniendo tu... algo",
			f:(params,message)=>{
				message.channel.send("<@"+message.author.id+">");
			}
		},
		dox:{
			desc:"pa doxxear al edgy que se cree sasuke\n>      Parametros: @Edgy",
			f:(params,message)=>{
				if(params[0] &&/\u003c\u0040.{0,1}\d+\u003e/.test(params[0])){
					let d=[];
					let did=TrimUserIdFromMention(params[0]);
					for(let i=0;i<4;i++){
						//console.log(did,"0."+did.substr(0,i*2));
						d.push(Math.floor(("0."+did.substr(i*2))*255));
					}
					message.channel.send(d.join("."));
				}
				else message.reply("Debes escojer a alguien para doxxear, Ejemplo: {{dox @Alguien");
			}
		},
		añonuevo:{
			desc:"te muestra cuanto tiempo falta para año nuevo",
			f:(params,message)=>{
				const ayear=31556926;
				const timestamp=Math.floor((new Date().getTime())/1000);
				let yearsPassed=Math.floor(Math.floor(timestamp)/ayear);
				
				let timeleftunix=ayear-(timestamp-(yearsPassed*ayear));
				
				let getDecimals=(num)=>{
					let whole=Math.floor(num);
					let dec=num-whole;
					return {
						whole,
						dec,
						num
					};
				};
				
				let l=getDecimals(timeleftunix/86400);
				let days=l.whole;
				l=getDecimals((l.dec*86400)/3600);
				let hours=l.whole;
				l=getDecimals((l.dec*3600)/60);
				let minutes=l.whole;
				let seconds=Math.floor(l.dec*60);
				
				message.channel.send(`Faltan ${days} Dias, ${hours} Horas, ${minutes} Minutos y ${seconds} Segundos para año nuevo`);
			}
		},
		ajedrez:{
			desc:"Juega con alguien a ajedrez version \"El levantamiento del rey cangrejo\"\n>      Parametros: [@Alguien]",
			f:(params,message)=>{
				if(message.mentions.users.size==0)
					return message.reply("Debes escribir un oponente valido, Ejemplo: {{ajedrez @Alguien");
				
				let ajedrez=new Ajedrez(
					message.author,
					message.mentions.users.first()
				);
				
				let t=ajedrez.BuildCurrentGameText();
				
				message.channel.send(t)
				.then(sended=>{
					ajedrez.GetEmogisForInputs().forEach(
						async (emj)=>sended.react(emj)
					);
				}).
				catch(console.log);
			}
		},
		f:{
			desc:"f",
			f:(params,message)=>{
				message.channel.send({
					content:"🇫",
					nonce:"F"
				}).then(mes=>mes.react("🇫"));
			}
		},
		soymongoloide:{
			desc:"por si acaso te gusta comer jabon",
			f:(params,message)=>{
				message.channel.send(
					"Ejemplos de uso:\n"+
					"   {{revertir este texto en reversa\n"+
					"   {{burrito\n"+
					"   {{dox @Alguien\n"+
					"\n"+
					"Parametros: Los parametros se escriben a la derecha de el comando separado de este con un espacio\n"+
					"   {{comando Parametro1 Parametro2"
				);
			}
		},
		mesopt:{
			desc:"mensaje de experimentacion, probando mandar mensajes con opciones",
			f:(params,message)=>{
				message.channel.send({
					content:"checnado el nonce de este mensaje",
					nonce:"el nonce equisde"
				}).then(m=>console.log(m.nonce));
				/*
				files: [{
						attachment: 'file.jpg',
						name: 'file.jpg',
						description: 'A description of the file'
					}],
				*/
			}
		}
	}
}