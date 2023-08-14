const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chatea con Memer'),
    inVoice: false,
    deleteInvocation: false,
    voiceCommand: ['chat', 'busca'],
    async execute(client, queue, message, content) {
        const { BingChat } = await import('bing-chat')

        console.log(message);
        console.log(content);

        const text = content.join(' ');
        if (!text) return { title: client.emotes.error + " No has escrito nada" }

        const api = new BingChat({
            cookie: client.config.bingCookie
        })

        const res = await api.sendMessage(text)
        console.log(res.text)

        return {
            content: res.text,
            reply: false,
            deleteResponse: false,
        }
    },
};