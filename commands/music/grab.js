const { SlashCommandBuilder } = require('discord.js');

const grab = (message, user, client) => {
    const queue = client.distube.getQueue(message);
    if (!queue)
        return "No se está reproduciendo nada";
    user.send(queue.songs[0].url);
    return "Tulún";
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('grab')
        .setDescription('Te envía el link de la canción por privado'),
    inVoice: false,
    voiceCommand: ['agarrar', 'grab'],
    async executeInteraction(interaction, client) {
        const result = grab(interaction, interaction.user, client);
        return interaction.editReply({ content: result, ephemeral: true });
    },
    async execute(content, message, client) {
        const result = grab(message, message.author, client);
        return message.reply(result).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
    }
};