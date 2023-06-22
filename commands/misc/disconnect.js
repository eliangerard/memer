const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('disconnect')
	.setDescription('Desconecta el bot del canal de voz'),
	inVoice: true,
	voiceCommand: ['salte', 'desconéctate'],
	async execute(client, queue, message, content) {
		const voiceJoined = await client.distube.voices.get(message.member.voice.channel);
		voiceJoined.leave();
		return { title: client.emotes.success + " Adiós" }
	},
};