const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'speech',
	once: false,
	async execute(message, client) {
		const user = message.author.username + message.author.discriminator;
		console.log(`${user}: ${message.content}`);
		if (!message.content) return;
		message.content = message.content.toLowerCase();
		const params = message.content.split(' ');
		if (!client.config.voicePrefix.includes(params.shift()))
			return;

		const voiceCommand = params.shift();
		console.log(`Comando dicho: ${voiceCommand}`);
		const command = client.commands.find(command => command.voiceCommand && command.voiceCommand.includes(voiceCommand));
		if (!command)
			return;

		try {
			const queue = client.distube.getQueue(message.guild);
			if (command.queueDependent && !queue) {
				const embed = new EmbedBuilder()
					.setTitle(client.emotes.error + " Error")
					.setColor("#FF0000")
					.setDescription("No se está reproduciendo nada")
					.setTimestamp()
					.setFooter({ text: client.user.username, iconURL: client.botURL });

				return message.channel.send({ embeds: [embed] }).then(msg => {
					setTimeout(() => msg.delete(), 15000)
				});
			}

			const { title = null, description = null, fields = [], image = null, thumbnail = null, react = [], handler = null } = await command.execute(client, queue, message, params);

			const embed = new EmbedBuilder()
				.setTitle(title)
				.setColor(client.config.accentColor)
				.setDescription(description)
				.addFields(...fields)
				.setImage(image)
				.setThumbnail(thumbnail)
				.setTimestamp()
				.setFooter({ text: client.user.username, iconURL: client.botURL });

			await queue.textChannel.send({ embeds: [embed] }).then(msg => {
				if (react.length > 0) {
					react.forEach(emoji => msg.react(emoji))
					client.on('messageReactionAdd', handler(reaction, user, msg));
				}
				else setTimeout(() => msg.delete(), 15000)
			});
		} catch (error) {
			console.error(error);
			await message.channel.send({ content: 'Hubo un error con este comando' });
		}
	},
};