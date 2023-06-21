module.exports = {
    name: 'messageCreate',
    once: false,
    execute(message, client) {
        console.log(message.content);
        console.log(!message.content.startsWith(client.config.prefix));
        if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

        const content = message.content.split(' ');
        const commandCalled = content.shift().substring(client.config.prefix.length);
        let command = client.commands.get(commandCalled);
        if (!command)
            command = client.commands.find(cmd => {
                console.log(cmd.alias);
                return cmd.alias && cmd.alias.includes(commandCalled)
            });

        if (!command && client.config.prefix.length > 0)
            return message.reply("No hay comando de esos")

        console.log(command);
        client.interaction = null;
        client.channel = message.channel;
        command.execute(content.join(' '), message, client);
        setTimeout(() => message.delete(), 15000);
    },
};