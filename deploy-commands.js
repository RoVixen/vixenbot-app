const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
	{
		name: 'ping',
		description: 'Replies with Pong!'
	},{
		name:"draco",
		description:"aja, draco, que paso con draco?"
	},{
		name:"ajugar",
		description:"llama a todos a jugar"
	},{
		name:"pronombres",
		description:"genera unos nuevos pronombres para tu genero"
	},{
		name:"rand",
		description:"genera un numero al azar del 0 al 1"
	},{
		name:"interactionobject",
		description:"debuguea el objeto de interaccion en formato json en la consola de la pc de ro"
	}
]; 

const config = require("./config.json");
const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands("908932159589466142", "880610440860811325"),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();