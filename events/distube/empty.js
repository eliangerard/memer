const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'empty',
	execute(queue) {
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.sad + " Soledad")
            .setColor("#1111EE")
            .setDescription("No hay nadie en el canal de voz, saliendo...")
            .setTimestamp()
            .setFooter({text: 'Memer', iconURL: client.botURL});

        queue.textChannel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
	},
};