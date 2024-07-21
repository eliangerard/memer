const { EmbedBuilder } = require("discord.js");
const { io } = require("../socket");

module.exports = {
	name: 'finish',
	execute(queue,client) {

        io.emit('queueUpdate', queue.songs);
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