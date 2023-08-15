const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chatea con Memer'),
    inVoice: false,
    deleteInvocation: false,
    voiceCommand: ['chat', 'busca'],
    async execute(client, queue, message, content) {

        const text = content.join(' ');

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + client.config.chimeraToken);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "model": "gpt-4",
            "max_tokens": 2000,
            "messages": [
                {
                    "role": "system",
                    "content": "Eres un miembro de un canal de discord llamado MEMZ"
                },
                {
                    "role": "user",
                    "content": text
                }
            ]
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'manual'
        };

        const { choices } = await fetch("https://chimeragpt.adventblocks.cc/api/v1/chat/completions", requestOptions)
            .then(response => response.json())

        return {
            content: choices[0].message.content,
            reply: false,
            deleteResponse: false,
        }
    },
};