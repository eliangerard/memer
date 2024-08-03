const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playskip')
        .setDescription('Reproduce una canción y saltea la canción actual')
        .addStringOption(option => option.setName('canción').setDescription('Lo que quieras reproducir, puede ser una búsqueda o un link').setRequired(true)),
    inVoice: true,
    alias: ['ps'],
    voiceCommand: ['reproduce ahora'],
    queueDependent: false,
    async execute(client, queue, message, params) {
        const song = params.join(' ');
        if (song.length == 0) return;

        if (queue && queue.length > 0) queue.skip();

        client.distube.play(message.member.voice.channel, song, { member: message.member, textChannel: message.channel });
        return {
            title: `Skipeando y buscando: ${song}`
        }
    }
};