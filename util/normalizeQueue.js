const normalizeQueue = (queue) => {

    console.log('normalizing queue', queue?.id, queue?.songs);
    if (!queue || !queue.songs) return [];

    const { songs } = queue;
    return songs.map(song => ({
        id: song.id,
        name: song.name,
        thumbnail: song.thumbnail,
        artist: {
            name: song.uploader.name
        },
    })) || [];
};

module.exports = {
    normalizeQueue
}