const { SlashCommandBuilder } = require('discord.js');

let page;
let totalPages;
let q;
let header;
const status = queue => `Volumen: \`${queue.volume}%\` | Filtro: \`${queue.filters.names.join(", ") || "Off"}\` | Repitiendo: \`${queue.repeatMode ? queue.repeatMode === 2 ? "Toda la cola" : "Esta canción" : "Nada"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

const updateQueue = (queue) => {
    header = `**Reproduciendo:** ${queue.songs[0].name} - \`${queue.songs[0].formattedDuration}\`\n ${status(queue)}`;
    q = ``;
    for(let i = page*10+1; i < (queue.songs.length > (page*10)+11 ? page*10+11 : queue.songs.length); i++)
        q += `**${i}.** ${queue.songs[i].name} - \`${queue.songs[i].formattedDuration}\`\n`;
    q += `\n*Página: ${(page+1)+"/"+totalPages}*`;
}

const handler = (reaction, user, msg) => {
    if(reaction.message.id == msg.id && !user.bot){
        if(reaction.emoji.name == "✅"){                        
            client.removeListener('messageReactionAdd', handler)
            return msg.delete();
        }    
        if(reaction.emoji.name == "➡️"){
            if(page == totalPages-1) page = 0;
            else page++;
            updateQueue(queue);
        }
        if(reaction.emoji.name == "⬅️"){
            if(page == 0) page = totalPages-1;
            else page--;
            updateQueue(queue);
        }
        const embed = new Discord.MessageEmbed()
        .setTitle(client.emotes.queue+" Cola")
        .setColor("#FFFFFF")
        .setDescription(`${header}`)
        .addField("En la lista:", `${q}`)
        .setTimestamp()
        .setFooter('Memer', client.botURL);

        msg.edit({ embeds: [embed] });
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
        .setDescription('Muestra la lista de reproducción del bot'),
    inVoice : false,
    alias : ['q'],
    voiceCommand : ['cola', 'lista'],
    queueDependent : true,
	async execute(client, queue, message, content) {
        page = 0;
        totalPages = Math.ceil(queue.songs.length/10);
        updateQueue(queue);

        return {
            title: client.emotes.queue+" Cola",
            description: `${header}`,
            fields: [{ name: "En la lista:", value: `${q}` }],
            react: ['⬅️', '➡️', '✅'],
            handler
        }
	},
};