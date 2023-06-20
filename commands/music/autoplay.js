const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const autoplay = (message, client) => {
    const queue = client.distube.getQueue(message);
    if (!queue) {
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.error + " Error")
            .setColor("#FF0000")
            .setDescription("No se está reproduciendo nada")
            .setTimestamp()
            .setFooter({ text: 'Memer', iconURL: client.botURL });

        return embed;
    }
    try {
        const autoplay = queue.toggleAutoplay()
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.success + " AutoPlay")
            .setColor("#FFFFFF")
            .setDescription(`Estado: \`${autoplay ? "Encendido" : "Apagado"}\``)
            .setTimestamp()
            .setFooter({ text: 'Memer', iconURL: client.botURL });

        return embed;
    } catch (e) {
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.error + " Error")
            .setColor("#FF0000")
            .setDescription("Descripción: " + e)
            .setTimestamp()
            .setFooter({ text: 'Memer', iconURL: client.botURL });

        return embed;
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Activa o desactiva el modo autoplay'),
    inVoice: true,
    voiceCommand: ['autoplay', 'auto'],
    async executeInteraction(interaction, client) {
        const embed = autoplay(interaction, client);
        return interaction.editReply({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
    },
    async execute(content, message, client) {
        const embed = autoplay(message, client);
        return client.channel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
    },
};