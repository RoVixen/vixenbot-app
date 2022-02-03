var PORT = process.env.PORT || 8080;

const { Client, Intents, Permissions } = require('discord.js');
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
]});
const { token,clientId } = require('./config.json');

client.on('ready', () => {
	//console.log(Intents.FLAGS);
	//console.log(Permissions.FLAGS);
	const link = client.generateInvite({
		permissions: [
			Permissions.FLAGS.SEND_MESSAGES,
			Permissions.FLAGS.MANAGE_GUILD,
			Permissions.FLAGS.MENTION_EVERYONE,
			Permissions.FLAGS.READ_MESSAGE_HISTORY
		],
		scopes: ['bot'],
	});
	console.log(`Generated bot invite link: ${link}`);
	//console.log(Permissions);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

	switch(interaction.commandName)
	{
		case "draco":{
			await interaction.reply('Quien? Draco? ese es un puto');
		}
		case "ajugar":{
			await interaction.reply('@everyone A JUGAR! TODOS REUNANSE MIERDA! VAMOS A JUGAR!');
		}
		case "pronombres":{
			await interaction.reply("Ahora tus nuevos pronombres de generos son: "+GenerarGeneros());
		}
		case "rand":{
			await interaction.reply(Math.random().toString());
		}
		case "interactionobject":{
			console.log(interaction);
			await interaction.reply("a");
		}
	}
});

const { chatCommands } = require("./chatcomandos.js");

client.on("messageCreate",message=>{
	if(message.author.id!=clientId){
		let sendHelp=()=>{
			let helpAnswer=
				"Prefijo: {{"+
				"\nEjemplos: {{revertir hola\n"+
				"Si no entiende como funciona, porfavor use el comando \"soymongoloide\". "+
				"Asi: \"{{soymongoloide\" pero sin las comillas\n\n";
			Object.entries(chatCommands).forEach(([key,val])=>{
				if(val.desc)
					helpAnswer+="> -"+key+": "+val.desc+"\n";
			});
			message.reply(helpAnswer);
		}
		
		let mes=message.content;
		if(mes.substr(0,2)=="{{"){
			let command=mes.slice(2).split(" ")[0];
			let params=mes.slice(2).split(" ").splice(1);
			
			if(command=="help"){
				sendHelp();
				return;
			}
			
			if(chatCommands[command]){
				let result = chatCommands[command].f(params,message,client);
				
				if(result)
					console.log(result);
			}
		}
		else if(message.mentions.users.size>0){
			if(message.mentions.users.find(u=>u.username==client.user.username))
				sendHelp();
		}
		else if(message.mentions.roles.size>0){
			if(message.mentions.roles.find(u=>u.name==client.user.username))
				sendHelp();
		}
	}
});

const { reactionHandler } = require("./reactionhandler.js");

client.on("messageReactionAdd",(messageReaction,user)=>{
	if(user.id!=clientId){
		let header=messageReaction.message.content.split("\n")[0];
		let [varname,value]=header.split(":");
		
		let result=false;
		if(reactionHandler[varname] && reactionHandler[varname][value])
			result = reactionHandler[varname][value].f(messageReaction,user,client);
		else if(reactionHandler[header])
			result = reactionHandler[header].f(messageReaction,user,client);
		else if(reactionHandler[messageReaction.message.nonce])
			result = reactionHandler[messageReaction.message.nonce].f(messageReaction,user,client);
			
		if(result)
				console.log(result);
	}
});

function GenerarGeneros(){
	const prons=[
		"el",
		"ella",
		"elle",
		"they",
		"zax",
		"hoe",
		"elicoptero",
		"pedo",
		"tarrak",
		"homeboy",
		"clod",
		":burrito:",
		"juan"
	];
	
	const pron=prons[Math.floor(Math.random()*prons.length)];
	
	return pron+"/"+pron+"s/"+pron+"self";
}


client.login(token);
