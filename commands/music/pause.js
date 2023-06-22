const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
        .setDescription('Pausa y resume la reproducción de la música'),
    inVoice : true,
    voiceCommand : ['pausa', 'pausar'],
    queueDependent : true,
	async execute(client, queue, message, content) {
        if (queue.paused) {
            queue.resume();
            return {
                title: client.emotes.success+" Resume",
                description: "Reanudando reproducción"
            }
        }
        queue.pause();
        return {
            title: client.emotes.success+" Pause",
            description: "Pausando reproducción"
        }
	},
};