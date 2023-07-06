const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
        .setDescription('Activa la repetición de, la queue o la canción')
        .addIntegerOption(option =>
            option.setName('mode')
                .setDescription('El modo de repetición')
                .setRequired(true)
                .addChoices(
                    { name: 'apagado', value: 0 },
                    { name: 'canción', value: 1 },
                    { name: 'queue', value: 2 },
        )),
    inVoice : false,
    voiceCommand : ['loop', 'repite'],
    queueDependent : true,
	async execute(client, queue, message, content) {
        let [mode] = content;
        mode = queue.setRepeatMode(mode);
        mode = mode ? mode === 2 ? "Repitiendo la cola" : "Repitiendo la canción" : "Apagado";
        return {
            title: client.emotes.repeat + " Loop",
            description: `Modo de repetición establecido: \`${mode}\``
        };
	}
};