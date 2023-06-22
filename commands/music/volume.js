const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
        .setDescription('Cambia el volumen de la reproducción')
        .addIntegerOption(option => option.setName('porcentaje').setDescription('Porcentaje del volumen').setRequired(true)),
    inVoice : true,
    alias : ['v'],
    voiceCommand : ['volumen'],
    queueDependent : true,
	async execute(client, queue, message, content) {
        const [volume] = content;
        queue.setVolume(volume);

        return {
            title: client.emotes.success+" Volumen actualizado",
            description: `Establecido en: \`${volume}\``
        }
	},        
};