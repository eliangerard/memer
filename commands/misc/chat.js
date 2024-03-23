const { CohereClient } = require('cohere-ai');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chatea con Memer'),
    inVoice: false,
    deleteInvocation: false,
    voiceCommand: ['chat', 'busca', 'dime'],
    async execute(client, queue, message, content) {
        const cohere = new CohereClient({
            token: client.config.cohereToken, // This is your trial API key
        });

        const text = content.join(' ');
        const response = await cohere.generate({
            model: client.config.cohereModel,
            prompt: `*${client.config.cohereInstruction}* ${text}`,
            maxTokens: 1000,
            temperature: 0.3,
            k: 0,
            stopSequences: [],
            returnLikelihoods: "NONE"
        });
        console.log(response);
        return {
            content : response.generations[0].text
        };
    },
};