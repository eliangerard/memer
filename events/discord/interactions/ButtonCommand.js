const { EmbedBuilder } = require('discord.js');

const executeButtonCommand = async (button, client) => {
    if (!button.customId) return;

    clearTimeout(client.timeouts[button.message.id].timeout);

    const timeout = setTimeout(() => client.timeouts[button.message.id].msg.delete(), 20000);
    client.timeouts[button.message.id].timeout = timeout;

    const command = client.commands.get(button.customId);

    try {
        if (command.inVoice && (button.member.voice.channel === undefined || button.guild.members.me.voice.channel.id !== button.member.voice.channel.id))
            return;

        const queue = client.distube.getQueue(button.guild);

        if (command.queueDependent && !queue) {
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.error + " Error")
                .setColor("#FF0000")
                .setDescription("No se está reproduciendo nada")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.botURL ? client.botURL : client.user.avatarURL() });

            return button.reply({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 3000)
            });
        }

        const params = [];

        const { title = null, description = null, fields = [], image = null, thumbnail = null, react = [], handler = null } = await command.execute(client, queue, button, params);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(client.config.accentColor)
            .setDescription(description)
            .addFields(...fields)
            .setImage(image)
            .setThumbnail(thumbnail)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.botURL });

        return button.reply({ embeds: [embed] }).then(async response => {
            const msg = await button.fetchReply();
            if (react.length > 0) {
                const newHandler = (reaction, user) => handler(reaction, user, msg, queue, client, newHandler);
                react.forEach(emoji => msg.react(emoji))
                client.on('messageReactionAdd', newHandler);
            }
            else setTimeout(() => msg.delete(), 3000)
        });
    } catch (error) {
        console.error(error);
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.error + " Error")
            .setColor("#FF0000")
            .setDescription("Descripción: " + error)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.botURL });
        return button.reply({ embeds: [embed] });
    }
}

module.exports = { executeButtonCommand };