const { EmbedBuilder } = require("discord.js");
const { client } = require("../../services/client");
const { io } = require("../socket");

module.exports = {
	name: 'empty',
	execute(queue) {
        
        io.emit('queueUpdate', queue.songs);
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.sad + " Soledad")
            .setColor(client.config.accentColor)
            .setDescription("No hay nadie en el canal de voz, saliendo...")
            .setTimestamp()
            .setFooter({text: 'Memer', iconURL: client.botURL});

        queue.textChannel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
	},
};