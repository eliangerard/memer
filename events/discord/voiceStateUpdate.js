const { ActivityType } = require("discord.js");
const { isVoiceChannelEmpty } = require("distube");

module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState, client) {
        if (oldState.channel && !isVoiceChannelEmpty(oldState.channel)) return;
        if (newState.channel && !isVoiceChannelEmpty(newState.channel)) return;
        if (oldState.channel && isVoiceChannelEmpty(oldState.channel)) {
            setTimeout(() => {
                if (isVoiceChannelEmpty(oldState.channel)) {
                    client.distube.voices.get(oldState.guild.id).leave();
                }
            }, 30000); // Espera 30 segundos (30000 milisegundos)
        }
    },
};