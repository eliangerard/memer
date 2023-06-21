const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");

const help = (commandResolvable = null, client) => {
    if (commandResolvable) {
        let command = client.commands.get(commandResolvable);
        if (!command)
            command = client.commands.find(cmd => {
                console.log(cmd.alias);
                return cmd.alias && cmd.alias.includes(commandResolvable)
            });

        if (!command) {
            const embed = new EmbedBuilder()
                .setTitle('Comando no encontrado')
                .setColor('#0099ff')
                .setTimestamp()
                .setFooter({ text: 'Memer', iconURL: client.botURL });
            return embed;
        }
        console.log(command);
        const fields = [
            {
                name: ' ',
                value: command.data.description
            }
        ];

        if (command.alias)
            fields.push({
                name: 'Alias para texto',
                value: '`' + (command.alias ? command.alias.join(', ') : 'N/A') + '`'
            });

        if (command.voiceCommand)
            fields.push({
                name: 'Comando por voz',
                value: '`' + command.voiceCommand.join(', ') + '`'
            })

        const embed = new EmbedBuilder()
            .setTitle(client.config.prefix + command.data.name)
            .setColor('#0099ff')
            .addFields(fields)
            .setTimestamp()
            .setFooter({ text: 'Memer', iconURL: client.botURL });
        return embed;
    }
    const fields = client.commands.map(command => ({
        name: ' ',
        value: '`' + client.config.prefix + command.data.name + '` - ' + command.data.description
    }));

    fields.push({
        name: 'Por comando',
        value: 'Usa `' + client.config.prefix + 'help <comando>` para ver sus alias y su activación por voz'
    })
    const embed = new EmbedBuilder()
        .setTitle('Comandos disponibles')
        .setColor('#0099ff')
        .addFields(fields)
        .setTimestamp()
        .setFooter({ text: 'Memer', iconURL: client.botURL });

    return embed;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Muestra los comandos del bot')
        .addStringOption(option => option.setName('comando').setDescription('El comando a mostrar').setRequired(false)),
    inVoice: false,
    alias: ['h'],
    voiceCommand: ['ayuda', 'comandos'],
    async executeInteraction(interaction, client) {
        const commandResolvable = interaction.options.getString('comando');
        const embed = help(commandResolvable, client);
        interaction.editReply({ embeds: [embed] });
    },
    async execute(content, message, client) {
        const embed = help(content, client);
        message.reply({ embeds: [embed] });
    },
};