const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Activa o desactiva el modo autoplay'),
    inVoice: true,
    alias: ['ap'],
    voiceCommand: ['autoplay', 'auto'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        const autoplay = queue.toggleAutoplay();
        return {
            title : client.emotes.success + " AutoPlay",
            description : `Estado: \`${autoplay ? "Encendido" : "Apagado"}\``
        };
    },
};