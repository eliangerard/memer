const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Conecta el bot al canal de voz'),
	inVoice: true,
	async execute(client, queue, message, content) {
		const voiceJoined = await client.distube.voices.join(message.member.voice.channel);
		voiceJoined.setSelfDeaf(false);
		return { title: client.emotes.success + " Listo" };
	},
};