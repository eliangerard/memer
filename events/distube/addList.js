const { EmbedBuilder } = require("discord.js");
const { io } = require("../socket");
const { normalizeQueue } = require("../../util/normalizeQueue");

module.exports = {
    name: 'addList',
    execute(queue, playlist, client) {

        io.to(queue.id).emit('queueUpdate', normalizeQueue(queue));
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.success + ` Añadiendo \`${playlist.name}\``)
            .setColor(client.config.accentColor)
            .setDescription(`¡Playlist añadida!\n${client.distube.status(queue)}`)
            .setTimestamp()
            .setFooter({ text: 'Memer', iconURL: client.botURL })

        if (!client.interaction)
            return queue.textChannel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            });

        client.interaction.editReply({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        })
    },
};