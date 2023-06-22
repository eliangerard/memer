const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Saltea la canción que se esté reproduciendo'),
    inVoice: true,
    alias: ['s'],
    voiceCommand: ['siguiente', 'skip'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        if (queue.songs.length == 1)
            queue.stop();
        else
            queue.skip();

        return {
            title: client.emotes.success + " Skip",
            color: client.config.accentColor
        };
    }
};