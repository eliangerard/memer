const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Mueve la canción en la cola')
        .addIntegerOption(option => option.setName('from').setDescription('La canción que vas a mover').setRequired(true))
        .addIntegerOption(option => option.setName('to').setDescription('La posición a la que lo harás').setRequired(true)),
    inVoice: false,
    voiceCommand: ['mover', 'mueve'],
    queueDependent : true,
    async execute(client, queue, message, content) {

        console.log("MOviendo");
        const [from, to] = content;

        if (from < 1 || from > queue.songs.length || to < 1 || to > queue.songs.length) {
            return {
                title: "Error",
                description: "La canción no existe"
            }
        }

        const song = queue.songs.splice(from, 1)[0];
        queue.songs.splice(to, 0, song);

        return {
            title: "Canción movida",
            description: `La canción ${song.name} ha sido movida de la posición ${from} a la posición ${to}`
        }
    }
};