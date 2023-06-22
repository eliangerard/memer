const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una canción')
        .addStringOption(option => option.setName('canción').setDescription('Lo que quieras reproducir, puede ser una búsqueda o un link').setRequired(true)),
    inVoice: true,
    alias: ['p'],
    voiceCommand: ['reproduce', 'pon'],
    queueDependent: false,
    async execute(client, queue, message, params) {
        const song = params.join(' ');
        if (song.length == 0) return;
        client.distube.play(message.member.voice.channel, song, { member: message.member, textChannel: message.channel });
        return {
            title: `Buscando: ${song}`
        }
    }
};