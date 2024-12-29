const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { io } = require("../socket");
const { normalizeQueue } = require("../../util/normalizeQueue");

module.exports = {
	name: 'playSong',
	async execute(queue, song, client) {
		queue.setVolume(100);

		console.log(queue.songs);

		io.emit('queueUpdate', normalizeQueue(queue));
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

		const embed = new EmbedBuilder()
			.setTitle(client.emotes.play + " Reproduciendo")
			.setColor(client.config.accentColor)
			.addFields(
				{ name: "Canción: ", value: `[${song.name}](${song.url})` },
				{ name: "Duración: ", value: song.formattedDuration, inline: true },
				{ name: "Solicitada por: ", value: "<@!" + song.user + ">", inline: true },
				{ name: "Ajustes: ", value: client.distube.status(queue) }
			)
			.setThumbnail(client.config.cdGif)
			.setImage(queue.songs[0].thumbnail)
			.setTimestamp()
			.setFooter({ text: `(${song.views} vistas - 👍${song.likes})`, iconURL: client.botURL });

		if (!client.interaction)
			return queue.textChannel.send(
				{
					embeds: [embed],
					components: [buttonsRow, dbuttonsRow]
				}
			).then(msg => {
				const timeout = setTimeout(() => msg.delete(), 20000);
				client.timeouts[msg.id] = {
					timeout,
					msg
				};
			});
		return client.interaction.editReply({ embeds: [embed] }).then(msg => {
			const timeout = setTimeout(() => msg.delete(), 20000);
			client.timeouts[msg.id] = {
				timeout,
				msg
			};
		});
	},
};