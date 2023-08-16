const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

        const params = message.content.split(' ');

        const commandCalled = params.shift().substring(client.config.prefix.length);
        let command = client.commands.get(commandCalled);

        if (!command)
            command = client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandCalled));

        if (!command && client.config.prefix.length > 0)
            return message.reply("No hay comando de esos");

        if (!command && client.config.prefix.length == 0)
            return;

        if (!!command.deleteInvocation || command.deleteInvocation === undefined)
            setTimeout(() => message.delete(), 15000);

        try {
            if (command.inVoice) {
                if (message.member.voice.channel === undefined)
                    return message.reply('No estás en un canal de voz').then(msg => {
                        setTimeout(() => msg.delete(), 15000)
                    });
                if (command.inVoice && message.member.voice.channel && message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
                    console.log(message.guild.members.me.voice.channel);
                    return message.reply('No estás en el mismo canal de voz').then(msg => {
                        setTimeout(() => msg.delete(), 15000)
                    });

                }
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


            const {
                title = null,
                description = null,
                fields = [],
                image = null,
                thumbnail = null,
                react = [],
                handler = null,
                actionRows = null,
                resetTimeout = false,
                reply = true,
                deleteResponse = true,
                content = null
            } = await command.execute(client, queue, message, params);

            if(!!content)
                return await message.channel.send(content);

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setColor(client.config.accentColor)
                .setDescription(description)
                .addFields(...fields)
                .setImage(image)
                .setThumbnail(thumbnail)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.botURL });

            if (reply)
                await message.reply({ embeds: [embed], components: actionRows }).then(msg => {
                    if (react.length > 0) {
                        const newHandler = (reaction, user) => handler(reaction, user, msg, queue, client, newHandler);
                        react.forEach(emoji => msg.react(emoji))
                        client.on('messageReactionAdd', newHandler);
                    }
                    else {
                        if (resetTimeout) {
                            const timeout = setTimeout(() => msg.delete(), 20000);
                            client.timeouts[msg.id] = {
                                timeout,
                                msg
                            };
                        }
                        if (deleteResponse)
                            setTimeout(() => msg.delete(), 15000);
                    }
                });
            else {
                await message.channel.send({ embeds: [embed], components: actionRows }).then(msg => {
                    if (react.length > 0) {
                        const newHandler = (reaction, user) => handler(reaction, user, msg, queue, client, newHandler);
                        react.forEach(emoji => msg.react(emoji))
                        client.on('messageReactionAdd', newHandler);
                    }
                    else {
                        if (resetTimeout) {
                            const timeout = setTimeout(() => msg.delete(), 20000);
                            client.timeouts[msg.id] = {
                                timeout,
                                msg
                            };
                        }
                        setTimeout(() => msg.delete(), 15000);
                    }
                });
            }
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.error + " Error")
                .setColor("#FF0000")
                .setDescription("Descripción: " + error)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.botURL });
            await message.reply({ embeds: [embed] });
        }
    },
};