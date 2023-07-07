const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Muestra lo que se está reproduciendo en este momento'),
    inVoice: false,
    alias: ['np'],
    voiceCommand: ['cuál', 'cual'],
    queueDependent: true,
    async execute(client, queue, message, content) {

        const buttons = [
            new ButtonBuilder()
                .setCustomId('previous')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏪'),
            new ButtonBuilder()
                .setCustomId('pause')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏯️'),
            new ButtonBuilder()
                .setCustomId('stop')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏹️'),
            new ButtonBuilder()
                .setCustomId('skip')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏩'),
            new ButtonBuilder()
                .setCustomId('loop')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔁'),
        ];
        const dbuttons = [
            new ButtonBuilder()
                .setCustomId('queue')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📃'),
            new ButtonBuilder()
                .setCustomId('grab')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🫳'),
            new ButtonBuilder()
                .setCustomId('autoplay')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🎶'),
            new ButtonBuilder()
                .setCustomId('shuffle')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔀'),
            new ButtonBuilder()
                .setCustomId('disconnect')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('⬜'),
        ];

        const buttonsRow = new ActionRowBuilder()
            .addComponents(...buttons);
        const dbuttonsRow = new ActionRowBuilder()
            .addComponents(...dbuttons);

        return {
            title: client.emotes.play + " Reproduciendo",
            fields: [
                { name: "Canción: ", value: `[${queue.songs[0].name}](${queue.songs[0].url})` },
                { name: "Duración: ", value: queue.formattedDuration, inline: true },
                { name: "Tiempo: ", value: queue.formattedCurrentTime, inline: true },
                { name: "Solicitada por: ", value: "<@!" + queue.songs[0].user + ">", inline: true },
                { name: "Ajustes: ", value: client.distube.status(queue) }
            ],
            thumbnail: client.config.cdGif,
            image: queue.songs[0].thumbnail,
            actionRows: [buttonsRow, dbuttonsRow],
            resetTimeout: true
        }
    }
};