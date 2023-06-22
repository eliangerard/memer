const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

        setTimeout(() => message.delete(), 15000);

        const params = message.content.split(' ');

        const commandCalled = params.shift().substring(client.config.prefix.length);
        let command = client.commands.get(commandCalled);

        if (!command)
            command = client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandCalled));

        if (!command && client.config.prefix.length > 0)
            return message.reply("No hay comando de esos");

        if (!command && client.config.prefix.length == 0)
            return;
        try {
            if (command.inVoice) {
                if (message.member.voice.channel === undefined)
                    return message.reply('No estás en un canal de voz').then(msg => {
                        setTimeout(() => msg.delete(), 15000)
                    });
                let voiceConnection;

                if (!message.guild.members.me.voice.channel)
                    voiceConnection = await client.distube.voices.join(message.member.voice.channel);
                else
                    voiceConnection = await client.distube.voices.get(message.member.voice.channel);

                voiceConnection.setSelfDeaf(false);
            }

            const queue = client.distube.getQueue(message.guild);
            if (command.queueDependent && !queue) {
                const embed = new EmbedBuilder()
                    .setTitle(client.emotes.error + " Error")
                    .setColor("#FF0000")
                    .setDescription("No se está reproduciendo nada")
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.botURL });

                return message.reply({ embeds: [embed] }).then(msg => {
                    setTimeout(() => msg.delete(), 15000)
                });
            }

            const { title = null, description = null, fields = [], image = null, thumbnail = null, react = [], handler = null } = await command.execute(client, queue, message, params);

            console.log({ text: client.user.username, iconURL: client.botURL });
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setColor(client.config.accentColor)
                .setDescription(description)
                .addFields(...fields)
                .setImage(image)
                .setThumbnail(thumbnail)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.botURL });

            await message.reply({ embeds: [embed] }).then(msg => {
                if (react.length > 0) {
                    react.forEach(emoji => msg.react(emoji))
                    client.on('messageReactionAdd', handler(reaction, user, msg));
                }
                else setTimeout(() => msg.delete(), 15000);
            });
        } catch (error) {
            console.error(error);
            await message.reply({ content: 'Hubo un error con este comando' });
        }
    },
};