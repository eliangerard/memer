const { EmbedBuilder } = require("discord.js");
const { io } = require("../socket");
const { normalizeQueue } = require("../../util/normalizeQueue");

module.exports = {
    name: 'addSong',
    execute(queue, song, client) {
        if (queue.songs.length == 0) return;

        io.to(queue.id).emit('queueUpdate', normalizeQueue(queue));
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.success + " Añadiendo")
            .setColor(client.config.accentColor)
            .setDescription(`${song.name} - \`${song.formattedDuration}\` | añadida por: ${song.user}`)
            .setTimestamp()
            .setFooter({ text: 'Memer', iconURL: client.botURL });

        if (!client.interaction)
            return queue.textChannel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            });

        return client.interaction.editReply({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
    },
};