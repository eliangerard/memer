const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Quita la canción de la cola')
        .addIntegerOption(option => option.setName('song').setDescription('La canción que vas a quitar').setRequired(true)),
    inVoice: true,
    voiceCommand: ['quita la canción', 'quita', 'elimina'],
    queueDependent : true,
    async execute(client, queue, message, content) {

        const [song] = content;

        if (song < 1 || song > queue.songs.length) {
            return {
                title: "Error",
                description: "La canción no existe"
            }
        }

        const removedSong = queue.songs.splice(song, 1);

        return {
            title: "Canción eliminada",
            description: `La canción ${removedSong.name} ha sido removida de la cola`
        }
    }
};