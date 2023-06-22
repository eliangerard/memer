const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Muestra lo que se está reproduciendo en este momento'),
    inVoice: false,
    alias: ['np'],
    voiceCommand: ['cuál', 'cual'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        return {
            title: client.emotes.play + " Reproduciendo",
            fields: [
                { name: "Canción: ", value: queue.songs[0].name },
                { name: "Duración: ", value: queue.formattedDuration, inline: true },
                { name: "Tiempo: ", value: queue.formattedCurrentTime, inline: true },
                { name: "Solicitada por: ", value: "<@!" + queue.songs[0].user + ">", inline: true },
                { name: "Ajustes: ", value: client.distube.status(queue) }
            ],
            thumbnail: client.config.cdGif,
            image: queue.songs[0].thumbnail
        }
    }
};