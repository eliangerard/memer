const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'finish',
	execute(queue,client) {
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.success + ` Finished`)
            .setDescription("Cola terminada")
            .setColor("#FFFFFF")
            .setTimestamp()
            .setFooter({text: 'Memer', iconURL: client.botURL});

        queue.textChannel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        })    
	},
};