const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'error',
	execute(e, queue, song, client) {
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.error + " Error")
            .setColor("#FF0000")
            .setDescription("Descripción: " + e)
            .setTimestamp()
            .setFooter({text:'Memer', iconURL: client.botURL})
        
        queue.textChannel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        })    
        console.error(e, song)
	},
};