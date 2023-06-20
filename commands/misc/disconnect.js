const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");

const leave = async (channel, client) => {
	const voiceJoined = await client.distube.voices.get(msg.member.voice.channel);
	voiceJoined.leave();
	const embed = new EmbedBuilder()
		.setTitle(client.emotes.success + " Adiós")
		.setColor("#efefef");
	return embed;
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Desconecta el bot del canal de voz'),
	inVoice: true,
	voiceCommand: ['salte', 'desconéctate'],
	async executeInteraction(interaction, client) {
		const embed = leave(interaction.member.voice.channel, client)
		interaction.editReply({ embeds: [embed] }).then(msg => {
			setTimeout(() => msg.delete(), 15000)
		});
	},
	async execute(content, msg, client) {
		const embed = leave(msg.member.voice.channel, client)
		client.channel.send({ embeds: [embed] }).then(msg => {
			setTimeout(() => msg.delete(), 15000)
		});

	},
};