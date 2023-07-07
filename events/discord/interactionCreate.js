const { executeChatInputCommand, executeStringDropdown, executeButtonCommand } = require('./interactions')
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		console.log(interaction);
		if (interaction.isChatInputCommand()) 
			return executeChatInputCommand(interaction, client);

		if (interaction.isSelectMenu())
			return executeStringDropdown(interaction, client);
		
		if (interaction.isButton())
			return executeButtonCommand(interaction, client);
	},
};