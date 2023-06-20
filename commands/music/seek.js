const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");

const seek = (guild, seconds, client) => {
    const queue = client.distube.getQueue(guild);

    if (!queue) {
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.error + " Error")
            .setColor("#FF0000")
            .setDescription("No se está reproduciendo nada")
            .setTimestamp()
            .setFooter({ text: 'Memer', iconURL: client.botURL })
        return embed;
    }
    queue.seek(seconds);
    const embed = new EmbedBuilder()
        .setTitle(client.emotes.success + " Seek")
        .setColor("#FFFFFF")
        .setDescription(`Saltando a ${seconds}!`)
        .setTimestamp()
        .setFooter({ text: 'Memer', iconURL: client.botURL });
    return embed;
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Salta al segundo que indiques')
        .addIntegerOption(option => option.setName('segundos').setDescription('Segundos a los que se tiene que saltar la reproducción').setRequired(true)),
    inVoice: true,
    voiceCommand: ['segundo'],
    async executeInteraction(interaction, client) {
        const seconds = interaction.options.getInteger('segundos');
        seek(interaction.guild, seconds, client)
        return interaction.editReply({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
    },
    async execute(content, msg, client) {
        if (isNaN(content)) return;
        const seconds = Number(content);
        const embed = seek(msg.guild, seconds, client);
        return client.channel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
    }
};