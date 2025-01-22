module.exports = {
    name: 'ffmpegDebug',
    execute(e, queue, song, client) {
        console.log('ffmpegDebug:', e);
    },
};