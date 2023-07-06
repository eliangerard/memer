const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grab')
        .setDescription('Te envía el link de la canción por privado'),
    inVoice: false,
    voiceCommand: ['agarrar', 'grab'],
    queueDependent : true,
    async execute(client, queue, message, content) {
        message.author.send(queue.songs[0].url);
        return { title : "Tulún" };
    }
};