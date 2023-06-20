const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");

const join = async (channel, client) => {
	const voiceJoined = await client.distube.voices.join(channel);
	voiceJoined.setSelfDeaf(false);
	const embed = new EmbedBuilder()
		.setTitle(client.emotes.success + " Listo")
		.setColor("#FFFFFF");
	return embed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Conecta el bot al canal de voz'),
	inVoice: true,
	async executeInteraction(interaction, client) {
		const embed = await join(interaction.member.voice.channel, client);
		interaction.editReply({ embeds: [embed] }).then(msg => {
			setTimeout(() => msg.delete(), 15000)
		});
	},
	async execute(content, message, client) {
		const embed = await join(message.member.voice.channel, client);
		message.reply({ embeds: [embed] }).then(msg => {
			setTimeout(() => msg.delete(), 15000)
		});
	},
};