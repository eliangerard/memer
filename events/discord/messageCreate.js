const { command } = require("execa");

module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message, client) {
        console.log(message.content);
        console.log(!message.content.startsWith(client.config.prefix));
        if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
        
        const content = message.content.split(' ');
        console.log(content);
        const commandCalled = content.shift().substring(1);
        console.log(commandCalled);
        const command = client.commands.get(commandCalled);
        console.log(command);
        client.interaction = null;
        client.channel = message.channel;
        if(!command)
            return message.reply("No hay comando de esos")

        command.execute(content.join(' '), message, client);
	},
};