const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Añade o remueve un filtro activo a la reproducción')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('El filtro a activar o desactivar')
                .setRequired(true)
                .addChoices(
                    { name: '3d', value: '3d' },
                    { name: 'bassboost', value: 'bassboost' },
                    { name: 'echo', value: 'echo' },
                    { name: 'karaoke', value: 'karaoke' },
                    { name: 'nightcore', value: 'nightcore' },
                    { name: 'vaporwave', value: 'vaporwave' },
                    { name: 'flanger', value: 'flanger' },
                    { name: 'gate', value: 'gate' },
                    { name: 'haas', value: 'haas' },
                    { name: 'reverse', value: 'reverse' },
                    { name: 'surround', value: 'surround' },
                    { name: 'mcompand', value: 'mcompand' },
                    { name: 'phaser', value: 'phaser' },
                    { name: 'tremolo', value: 'tremolo' },
                    { name: 'earwax', value: 'earwax' }
                )
        ),
    inVoice: false,
    voiceCommand: ['filtros', 'filtro', 'f'],
    queueDependent: true,

    async execute(client, queue, message, content) {
        const [filter] = content;
        try {
            if (queue.filters.has(filter)) {
                queue.filters.remove(filter);
                return { title: `${client.emotes.success} Filtro ${filter} desactivado` };
            }
            else {
                queue.filters.add(filter);
                return { title: `${client.emotes.success} Filtro ${filter} activado` };
            }
        } catch (e) {
            return {
                title: `${client.emotes.success} El filtro ${filter} no existe`,
                description: 'Verifica el comando ```/filter``` o usa ```' + client.config.prefix + 'help filter``` para obtener la lista de filtros.'
            };
        }

    }
};