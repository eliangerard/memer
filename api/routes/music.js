const express = require('express');
const { client } = require('../../services/client');
const { verifySession } = require('../middlewares/verifySession');
const { toObject } = require('../../util/toObject');
const Command = require('../../models/Command');
const music = express.Router();

music.post('/search', async (req, res) => {
    const { query, index = null } = req.body;
    console.log('Searching', query);
    const response = await fetch(`https://api.deezer.com/search?q=${query}${index ? `&index=${index}` : ''}`);
    const json = await response.json();
    const nextIndex = json.next ? new URL(json.next).searchParams.get('index') : null;
    res.send({
        songs: json.data.filter(track => track.type === 'track'),
        next: nextIndex
    });
})

music.get('/chart', async (req, res) => {
    const response = await fetch('https://api.deezer.com/chart')
    const json = await response.json();
    res.send(json.tracks.data.filter(track => track.type === 'track'));
});

music.get('/servers', verifySession, async (req, res) => {
    console.log(req.user);
    const botServers = await client.guilds.fetch();
    const userServers = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${req.user.access_token}`
        }
    }).then(response => response.json());

    const similarServers = botServers.filter(server => userServers?.some(userServer => userServer.id === server.id));

    res.json(toObject(similarServers));
})

music.get("/server/:id/activity", verifySession, async (req, res) => {
    const { id } = req.params;
    if (!id) return res.json(
        { activity: {} }
    );
    const activty = await Command.find({ guildId: id });
    res.json(activty);
})


music.get("/server/:id/queue", verifySession, async (req, res) => {
    const { id } = req.params;
    if (!id) return res.json(
        { songs: [] }
    );
    console.log(id);
    const guild = await client.guilds.fetch(id);
    console.log(guild.id);
    const queue = client.distube.getQueue(guild);
    console.log(queue);
    if (!queue) return res.json(
        { songs: [] }
    );
    res.json({
        currentTime: queue.currentTime,
        songs: queue.songs
    });
})

module.exports = { music };