const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Reproduce la canción anterior'),
    inVoice: true,
    alias: ['prev'],
    voiceCommand: ['anterior', 'regresa'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        queue.previous();
        return {
            title: client.emotes.success + " Reproduciendo canción anterior"
        }
    },
};