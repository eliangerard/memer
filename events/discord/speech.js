const { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { createAudioFile } = require('simple-tts-mp3');
module.exports = {
	name: 'speech',
	once: false,
	async execute(message, client) {
		const user = message.author.username + message.author.discriminator;
		if (!message.content) return;
		message.content = message.content.toLowerCase();
		const params = message.content.split(' ');
		if (params[0] === 'oye') params.shift();
		if (!client.config.voicePrefix.includes(params.shift()))
			return;
		
		const voiceCommand = params.shift();
		console.log(`${user}: ${message.content}`);
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
					.setFooter({ text: client.user.username, iconURL: client.botURL ? client.botURL : client.user.avatarURL() });

				return message.channel.send({ embeds: [embed] }).then(msg => {
					setTimeout(() => msg.delete(), 15000)
				});
			}

			const {
				title = null,
				description = null,
				fields = [],
				image = null,
				thumbnail = null,
				react = [],
				handler = null,
				actionRows = null,
				resetTimeout = false,
				content = false
			} = await command.execute(client, queue, message, params);

			if (!!content) {
				const distubePlayer = client.distube.voices.get(message.guild.id).audioPlayer;
				const voiceChannel = getVoiceConnection(message.guild.id, client.config.clientId);

				await createAudioFile(content, './tts', 'es');
				const player = createAudioPlayer();
				const resource = createAudioResource('./tts.mp3');
				player.play(resource);
				voiceChannel.subscribe(player);
				player.on(AudioPlayerStatus.Idle, () => {
					player.stop();
					voiceChannel.subscribe(distubePlayer);
				});
				return;
			}

			const embed = new EmbedBuilder()
				.setTitle(title)
				.setColor(client.config.accentColor)
				.setDescription(description)
				.addFields(...fields)
				.setImage(image)
				.setThumbnail(thumbnail)
				.setTimestamp()
				.setFooter({ text: client.user.username, iconURL: client.botURL });

			await message.channel.send({ embeds: [embed], components: actionRows }).then(msg => {
				if (react.length > 0) {
					const newHandler = (reaction, user) => handler(reaction, user, msg, queue, client, newHandler);
					react.forEach(emoji => msg.react(emoji))
					client.on('messageReactionAdd', newHandler);
				}
				else {
					if (resetTimeout) {
						const timeout = setTimeout(() => msg.delete(), 20000);
						client.timeouts[msg.id] = {
							timeout,
							msg
						};
					}
					setTimeout(() => msg.delete(), 15000);
				}
			});
		} catch (error) {
			console.error(error);
			const embed = new EmbedBuilder()
				.setTitle(client.emotes.error + " Error")
				.setColor("#FF0000")
				.setDescription("Descripción: " + error)
				.setTimestamp()
				.setFooter({ text: 'Memer', iconURL: client.botURL })
			await message.channel.send({ embeds: [embed] });
		}
	},
};