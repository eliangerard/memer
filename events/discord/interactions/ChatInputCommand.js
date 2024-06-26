const { EmbedBuilder } = require('discord.js');

const executeChatInputCommand = async (interaction, client) => {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await interaction.deferReply();
        if (command.inVoice) {
            if (interaction.member.voice.channel === undefined)
                return interaction.editReply({ content: 'No estás en un canal de voz', ephemeral: true });
            if (command.inVoice && interaction.member.voice.channel && interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id)
                return interaction.editReply({ content: 'No estás en el mismo canal de voz', ephemeral: true });
            let voiceConnection;

            if (!interaction.guild.members.me.voice.channel)
                voiceConnection = await client.distube.voices.join(interaction.member.voice.channel);
            else
                voiceConnection = await client.distube.voices.get(interaction.member.voice.channel);

            voiceConnection.setSelfDeaf(false);
        }

        const queue = client.distube.getQueue(interaction.guild);
        if (command.queueDependent && !queue) {
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.error + " Error")
                .setColor("#FF0000")
                .setDescription("No se está reproduciendo nada")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.botURL ? client.botURL : client.user.avatarURL() });

            return interaction.editReply({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            });
        }

        const params = interaction.options.data.map((option) => option.value);

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
            content = null
        } = await command.execute(client, queue, interaction, params);

        if (!!content)
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

        await interaction.editReply({ embeds: [embed], components: actionRows }).then(msg => {
            if (react.length > 0) {
                react.forEach(emoji => msg.react(emoji))
                client.on('messageReactionAdd', handler);
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
    } catch (error) {
        console.error(error);
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.error + " Error")
            .setColor("#FF0000")
            .setDescription("Descripción: " + error)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.botURL });
        await interaction.editReply({ embeds: [embed] });
    }
}

module.exports = { executeChatInputCommand };