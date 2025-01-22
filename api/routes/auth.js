const express = require('express');
const { client } = require('../../services/client');
const { verifySession } = require('../middlewares/verifySession');
const User = require('../../models/User');
const auth = express.Router();

auth.get('/refresh', async (req, res) => {
    const refresh_token = req.headers.authorization.split(' ')[1];

    if (!refresh_token) return res.status(400).send({ message: 'No token provided' });

    const redirect_uri = req.headers.origin + '/callback/discord';

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: client.config.uiClientId,
            client_secret: client.config.uiSecret,
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            redirect_uri,
            scope: 'identify'
        })
    })
    const json = await response.json();
    const meResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `Bearer ${json.access_token}`
        }
    })

    const { id } = await meResponse.json();
    if (!id) return res.status(401).send({ message: 'Unauthorized' });

    const user = await client.users.fetch(id);
    res.send({ ...json, ...user, 
        activeBot: client.user.id
     });
})

auth.post('/login', async (req, res) => {
    const { code } = req.body;
    
    const redirect_uri = req.headers.origin + '/callback/discord';
    console.log('code', code, redirect_uri);

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: client.config.uiClientId,
            client_secret: client.config.uiSecret,
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            scope: 'identify'
        })
    })
    const json = await response.json();

    console.log(json);

    const meResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `Bearer ${json.access_token}`
        }
    });
    const me = await meResponse.json();
    console.log(me);

    const { id } = me;
    if (!id) return res.status(401).send({ message: 'Unauthorized' });

    res.send({ ...me, ...json, activeBot: client.user.id });
})

auth.post('/logout', async (req, res) => {
    const { token } = req.body;
    const response = await fetch('https://discord.com/api/oauth2/token/revoke', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: client.config.uiClientId,
            client_secret: client.config.uiSecret,
            token,
            token_type_hint: 'refresh_token'
        })
    })
    res.send(await response.json());
})

auth.post('/verify', verifySession, async (req, res) => {
    res.send({ user: req.user });
})

auth.post('/spotify', verifySession, async (req, res) => {
    const { code } = req.body;
    console.log('code', code);

    const spotifySession = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${client.config.spotifyClientId}:${client.config.spotifySecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: client.config.spotifyRedirectUri,
            client_id: client.config.spotifyClientId,
        })
    }).then(res => res.json());

    console.log(spotifySession);

    const user = new User({
        discordId: req.user.id,
        spotifyRefresh: spotifySession.refresh_token
    });

    await user.save();

    console.log(user);

    res.json(spotifySession);
})

auth.post('/spotify/refresh', verifySession, async (req, res) => {
    if (!req.headers?.sauthorization) return res.status(400).send({ message: 'No token provided' });
    const refresh = req.headers.sauthorization.split(' ')[1];

    console.log("Refresh:", refresh);
    if (!refresh) return res.status(400).send({ message: 'No token provided' });

    const spotifySession = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${client.config.spotifyClientId}:${client.config.spotifySecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh,
            client_id: client.config.spotifyClientId,
        })
    }).then(res => res.json());

    console.log(spotifySession);
    res.json(spotifySession);

})

module.exports = { auth };