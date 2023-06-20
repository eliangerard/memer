const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
        .setDescription('Aleatoriza la queue'),
    inVoice : false,
    voiceCommand : ['aleatoriza', 'revuelve'],
	async executeInteraction(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        try {
            queue.shuffle();
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.success + " Shuffle")
                .setColor("#FFFFFF")
                .setDescription("¡Queue revuelta!")
                .setTimestamp()
                .setFooter({ text : 'Memer', iconURL : client.botURL });

            return interaction.editReply({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            });
        }
        catch(e){
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.error + " Error")
                .setColor("#FF0000")
                .setDescription(""+e)
                .setTimestamp()
                .setFooter({ text : 'Memer', iconURL : client.botURL });
            
            return interaction.editReply({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            });
        }
	},
    async execute(content, msg, client) {
        const queue = client.distube.getQueue(msg.guild);
        try {
            queue.shuffle();
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.success + " Shuffle")
                .setColor("#FFFFFF")
                .setDescription("¡Queue revuelta!")
                .setTimestamp()
                .setFooter({ text : 'Memer', iconURL : client.botURL });

            return client.channel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            });
        }
        catch(e){
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.error + " Error")
                .setColor("#FF0000")
                .setDescription(""+e)
                .setTimestamp()
                .setFooter({ text : 'Memer', iconURL : client.botURL });
            
            return client.channel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            });
        }
    }
};