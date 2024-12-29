const { EmbedBuilder } = require("discord.js");
const { io } = require("../socket");
const { normalizeQueue } = require("../../util/normalizeQueue");

module.exports = {
	name: 'finish',
	execute(queue,client) {

        io.to(queue.id).emit('queueUpdate', normalizeQueue(queue));
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.success + ` Finished`)
            .setDescription("Cola terminada")
            .setColor(client.config.accentColor)
            .setTimestamp()
            .setFooter({text: 'Memer', iconURL: client.botURL});

        queue.textChannel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        })    
	},
};